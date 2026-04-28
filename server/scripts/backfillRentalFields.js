require("dotenv").config();
const connectDB = require("../config/db.js");
const User = require("../models/User.js");
const Book = require("../models/Book.js");
const Wallet = require("../models/Wallet.js");
const Rental = require("../models/Rental.js");
const { calculateBookPricing } = require("../utils/categoryPricing.js");

async function backfillUsers() {
  const result = await User.updateMany(
    {},
    {
      $set: {
        walletBalanceCache: 0,
        pendingDuesTotal: 0,
        isFlagged: false,
        depositAmount: 0,
        depositStatus: "pending",
        maxRentalsAllowed: 3,
        isSuspended: false,
      },
    },
  );

  await User.updateMany(
    {
      $or: [{ activeRentalsCount: { $exists: false } }, { activeRentalsCount: null }],
    },
    { $set: { activeRentalsCount: 0 } },
  );

  return result;
}

async function backfillBooks() {
  const books = await Book.find({}).lean();

  if (books.length === 0) {
    return { matchedCount: 0, modifiedCount: 0 };
  }

  const operations = books.map((book) => {
    const basePrice = book.rentPrice ?? book.price ?? 0;
    const pricing = calculateBookPricing({
      basePrice,
      category: book.category,
    });

    return {
      updateOne: {
        filter: { _id: book._id },
        update: {
          $set: {
            rentPrice: pricing.rentPrice,
            pricePerDay: pricing.pricePerDay,
            pricePerWeek: pricing.pricePerWeek,
            pricePerMonth: pricing.pricePerMonth,
            depositAmount: book.depositAmount ?? Math.max(50, pricing.depositAmount),
            replacementCost: book.replacementCost ?? pricing.replacementCost,
            averageRating: book.averageRating ?? 0,
            totalReviews: book.totalReviews ?? 0,
            isAvailable: book.isAvailable ?? true,
            unavailabilityReason: book.unavailabilityReason ?? "none",
          },
          $unset: {
            price: 1,
            depositRequired: 1,
            penaltyPerDay: 1,
          },
        },
      },
    };
  });

  const result = await Book.bulkWrite(operations, { ordered: false });

  return {
    matchedCount: books.length,
    modifiedCount: result.modifiedCount || 0,
  };
}

async function backfillWallets() {
  const users = await User.find({}).select("_id walletBalanceCache").lean();
  const bulk = users.map((user) => ({
    updateOne: {
      filter: { user: user._id },
      update: {
        $setOnInsert: {
          user: user._id,
          balance: user.walletBalanceCache || 0,
          lastUpdated: new Date(),
        },
      },
      upsert: true,
    },
  }));

  if (bulk.length === 0) {
    return { upsertedCount: 0 };
  }

  return Wallet.bulkWrite(bulk);
}

async function backfillRentals() {
  const rentals = await Rental.find({}).lean();

  if (rentals.length === 0) {
    return { matchedCount: 0, modifiedCount: 0 };
  }

  const operations = rentals.map((rental) => {
    const legacyDepositRefunded = rental.depositRefunded;
    const normalizedDepositRefunded =
      typeof legacyDepositRefunded === "boolean"
        ? legacyDepositRefunded
          ? Number(rental.depositAmount || 0)
          : 0
        : Number(legacyDepositRefunded || 0);

    return {
      updateOne: {
        filter: { _id: rental._id },
        update: {
          $set: {
            rentalType: rental.rentalType ?? "daily",
            rentalDuration: rental.rentalDuration ?? 7,
            rentalFee: rental.rentalFee ?? Number(rental.penaltyAmount || 0),
            depositAmount: rental.depositAmount ?? 0,
            rentedAt: rental.rentedAt ?? rental.startDate ?? rental.createdAt,
            dueDate: rental.dueDate,
            returnedAt: rental.returnedAt ?? rental.returnedDate ?? null,
            damageCharge: rental.damageCharge ?? 0,
            depositRefundEligible:
              rental.depositRefundEligible ??
              (typeof legacyDepositRefunded === "number" ? Number(legacyDepositRefunded || 0) : 0),
            overdueCharge: rental.overdueCharge ?? Number(rental.penaltyAmount || 0),
            depositRefunded: normalizedDepositRefunded,
            depositReleaseStatus:
              rental.depositReleaseStatus ??
              (normalizedDepositRefunded > 0 ? "released" : "none"),
            status: rental.status === "penalised" ? "flagged" : rental.status,
            restrictionApplied: rental.restrictionApplied ?? false,
          },
          $unset: {
            startDate: 1,
            returnedDate: 1,
            penaltyAmount: 1,
            penaltyPaid: 1,
          },
        },
      },
    };
  });

  const result = await Rental.bulkWrite(operations, { ordered: false });

  return {
    matchedCount: rentals.length,
    modifiedCount: result.modifiedCount || 0,
  };
}

async function run() {
  try {
    await connectDB();

    const [userResult, bookResult, walletResult, rentalResult] = await Promise.all([
      backfillUsers(),
      backfillBooks(),
      backfillWallets(),
      backfillRentals(),
    ]);

    console.log("Backfill completed successfully.");
    console.log(`Users matched: ${userResult.matchedCount}, modified: ${userResult.modifiedCount}`);
    console.log(`Books matched: ${bookResult.matchedCount}, modified: ${bookResult.modifiedCount}`);
    console.log(`Wallet upserts: ${walletResult.upsertedCount || 0}`);
    console.log(`Rentals matched: ${rentalResult.matchedCount}, modified: ${rentalResult.modifiedCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Backfill failed:", error);
    process.exit(1);
  }
}

run();
