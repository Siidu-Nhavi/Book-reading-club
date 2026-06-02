const Book = require("../models/Book.js");
const Rental = require("../models/Rental.js");
const User = require("../models/User.js");
const { getDueDate, getOverdueDays, getTotalRentPrice, roundCurrency } = require("../utils/rentalPricing.js");

function getRestrictionMessage({ user }) {
  if (user.isSuspended) {
    return "Your account is suspended";
  }

  if (user.activeRentalsCount >= user.maxRentalsAllowed) {
    return "Rental limit reached for your account";
  }

  return "";
}

async function evaluateRentalEligibility({ userId, bookId, rentalType, rentalDuration }) {
  const [user, book] = await Promise.all([
    User.findById(userId),
    Book.findById(bookId),
  ]);

  if (!user) {
    return { allowed: false, status: 404, message: "User not found" };
  }

  if (!book) {
    return { allowed: false, status: 404, message: "Book not found" };
  }

  if (!book.isAvailable) {
    return { allowed: false, status: 400, message: "Book is currently unavailable" };
  }

  const totalRentPrice = getTotalRentPrice(book, rentalType, rentalDuration);
  const depositAmount = roundCurrency(book.depositAmount);
  const total = roundCurrency(totalRentPrice + depositAmount);
  const restrictionMessage = getRestrictionMessage({ user });

  if (restrictionMessage) {
    return {
      allowed: false,
      status: 400,
      message: restrictionMessage,
      totalRentPrice,
      depositAmount,
      total,
    };
  }

  return {
    allowed: true,
    user,
    book,
    totalRentPrice,
    depositAmount,
    total,
  };
}

async function createRental({ userId, bookId, rentalType, rentalDuration }) {
  const eligibility = await evaluateRentalEligibility({ userId, bookId, rentalType, rentalDuration });

  if (!eligibility.allowed) {
    return eligibility;
  }

  const rentedAt = new Date();
  const dueDate = getDueDate(rentedAt, rentalType, rentalDuration);

  const rental = await Rental.create({
    user: userId,
    book: bookId,
    rentalType,
    rentalDuration,
    totalRentPrice: eligibility.totalRentPrice,
    paymentStatus: "paid",
    paymentAmount: eligibility.total,
    paymentCurrency: "INR",
    paymentConfirmedAt: rentedAt,
    depositAmount: eligibility.depositAmount,
    rentedAt,
    dueDate,
    status: "active",
  });

  await Promise.all([
    Book.updateOne(
      { _id: bookId },
      {
        $set: {
          isAvailable: false,
          unavailabilityReason: "rented",
        },
      },
    ),
    User.updateOne({ _id: userId }, { $inc: { activeRentalsCount: 1 } }),
  ]);

  return {
    allowed: true,
    rental,
    chargedAmount: eligibility.total,
  };
}

function getDamageCharge({ condition, replacementCost, damagePercentage = null }) {
  switch (condition) {
    case "good":
      return 0;
    case "minor":
      return roundCurrency(replacementCost * damagePercentage);
    case "major":
      return roundCurrency(replacementCost * 0.75);
    case "lost":
      return roundCurrency(replacementCost);
    default:
      throw new Error("Unsupported damage condition");
  }
}

async function settleDamageAndDeposit({
  userId,
  rental,
  book,
  condition,
  damagePercentage = null,
}) {
  const damageCharge = getDamageCharge({
    condition,
    replacementCost: book.replacementCost,
    damagePercentage,
  });
  const deductible = roundCurrency(damageCharge - rental.depositAmount);
  const depositRefund = condition === "good"
    ? rental.depositAmount
    : Math.max(0, roundCurrency(rental.depositAmount - damageCharge));

  const shouldFlag = false;

  return {
    damageCharge,
    depositRefund,
    shouldFlag,
  };
}

async function releaseHeldDepositsIfEligible(userId) {
  const user = await User.findById(userId).select("activeRentalsCount");

  if (!user || user.activeRentalsCount > 0) {
    return {
      releasedAmount: 0,
      releasedRentalIds: [],
    };
  }

  const heldRentals = await Rental.find({
    user: userId,
    depositReleaseStatus: "held",
    depositRefundEligible: { $gt: 0 },
  }).populate("book", "title");

  let releasedAmount = 0;
  const releasedRentalIds = [];

  for (const heldRental of heldRentals) {
    const amount = roundCurrency(heldRental.depositRefundEligible || 0);

    if (amount <= 0) {
      continue;
    }

    await Rental.updateOne(
      { _id: heldRental._id },
      {
        $set: {
          depositRefunded: amount,
          depositReleaseStatus: "released",
        },
      },
    );

    releasedAmount = roundCurrency(releasedAmount + amount);
    releasedRentalIds.push(String(heldRental._id));
  }

  return {
    releasedAmount,
    releasedRentalIds,
  };
}

async function processReturn({
  rentalId,
  condition,
  damagePercentage = null,
  adminNote = "",
}) {
  const rental = await Rental.findById(rentalId).populate("book");

  if (!rental) {
    return { ok: false, status: 404, message: "Rental not found" };
  }

  if (rental.status === "returned") {
    return { ok: false, status: 400, message: "This rental was already returned" };
  }

  const book = rental.book;

  if (!book) {
    return { ok: false, status: 404, message: "Associated book not found" };
  }

  if (condition === "minor" && (!(damagePercentage >= 0.25) || !(damagePercentage <= 0.5))) {
    return {
      ok: false,
      status: 400,
      message: "Minor damage percentage must be between 25% and 50%",
    };
  }

  const settlement = await settleDamageAndDeposit({
    userId: rental.user,
    rental,
    book,
    condition,
    damagePercentage,
  });

  const returnedAt = new Date();
  const status = settlement.shouldFlag ? "flagged" : "returned";
  const releaseStatus =
    settlement.depositRefund > 0
      ? "held"
      : settlement.damageCharge > 0
        ? "forfeited"
        : "none";

  await Rental.updateOne(
    { _id: rental._id },
    {
      $set: {
        returnedAt,
        damageCondition: condition,
        damagePercentage: damagePercentage ?? null,
        damageCharge: settlement.damageCharge,
        depositRefundEligible: settlement.depositRefund,
        depositRefunded: 0,
        depositReleaseStatus: releaseStatus,
        restrictionApplied: settlement.shouldFlag,
        status,
        notes: adminNote,
      },
    },
  );

  const userUpdate = {
    $inc: {
      activeRentalsCount: -1,
    },
  };

  await User.updateOne(
    { _id: rental.user, activeRentalsCount: { $gt: 0 } },
    userUpdate,
  );

  const nextBookUpdate =
    condition === "lost"
      ? {
          isAvailable: false,
          unavailabilityReason: "lost",
        }
      : {
          isAvailable: true,
          unavailabilityReason: "none",
        };

  await Book.updateOne({ _id: book._id }, { $set: nextBookUpdate });
  const releasedDeposits = await releaseHeldDepositsIfEligible(rental.user);

  return {
    ok: true,
    rentalId: rental._id,
    returnedAt,
    status,
    condition,
    damageCharge: settlement.damageCharge,
    depositRefund: settlement.depositRefund,
    depositReleasedNow: releasedDeposits.releasedAmount,
    depositHeld: releaseStatus === "held" ? settlement.depositRefund : 0,
  };
}

async function applyOverdueCharges(now = new Date()) {
  const rentals = await Rental.find({
    status: { $in: ["active", "overdue"] },
    returnedAt: null,
    dueDate: { $lt: now },
  }).populate("book");

  const results = [];

  for (const rental of rentals) {
    const overdueDays = getOverdueDays(now, rental.dueDate);
    const lastChargeDate = rental.lastOverdueChargeAt
      ? new Date(rental.lastOverdueChargeAt)
      : new Date(rental.dueDate);
    const incrementalDays = getOverdueDays(now, lastChargeDate);

    if (incrementalDays <= 0) {
      continue;
    }

    const chargeAmount = roundCurrency((rental.book?.pricePerDay || 0) * incrementalDays);
    const nextStatus = overdueDays >= 7 ? "flagged" : "overdue";
    const shouldFlag = overdueDays >= 7;

    await Rental.updateOne(
      { _id: rental._id },
      {
        $set: {
          overdueDays,
          overdueCharge: roundCurrency((rental.overdueCharge || 0) + chargeAmount),
          lastOverdueChargeAt: now,
          status: nextStatus,
          restrictionApplied: shouldFlag,
        },
      },
    );

    results.push({
      rentalId: rental._id,
      overdueDays,
      charged: chargeAmount,
      status: nextStatus,
    });
  }

  return results;
}

async function getRentalAlerts(userId) {
  const rentals = await Rental.find({
    user: userId,
    status: { $in: ["active", "overdue", "flagged"] },
    returnedAt: null,
  }).populate("book", "title pricePerDay");

  const now = new Date();

  return rentals.map((rental) => {
    const diffMs = new Date(rental.dueDate).getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffMs / (24 * 60 * 60 * 1000));

    if (daysRemaining <= -1) {
      return {
        rentalId: rental._id,
        type: "overdue",
        message: `Overdue — ₹${Number(rental.book?.pricePerDay || 0).toFixed(0)}/day being charged`,
      };
    }

    if (daysRemaining === 0) {
      return {
        rentalId: rental._id,
        type: "due_today",
        message: "Return Today",
      };
    }

    if (daysRemaining <= 2) {
      return {
        rentalId: rental._id,
        type: "due_soon",
        message: `Due in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`,
      };
    }

    return null;
  }).filter(Boolean);
}

module.exports = {
  evaluateRentalEligibility,
  createRental,
  processReturn,
  applyOverdueCharges,
  getRentalAlerts,
  releaseHeldDepositsIfEligible,
};
