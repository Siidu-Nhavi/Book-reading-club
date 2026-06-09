const { pickOne, randomInt } = require("../lib/random");

const ACTIVE_STATUSES = new Set(["active", "overdue", "flagged"]);

function chooseRentalStatus(rng) {
  const value = rng();

  if (value < 0.28) {
    return "active";
  }

  if (value < 0.73) {
    return "returned";
  }

  return "flagged";
}

function getRentalDays(rentalType, rentalDuration) {
  if (rentalType === "daily") {
    return rentalDuration;
  }

  if (rentalType === "weekly") {
    return rentalDuration * 7;
  }

  return rentalDuration * 30;
}

function getDueDate(rentedAt, rentalType, rentalDuration) {
  const dueDate = new Date(rentedAt);

  if (rentalType === "daily") {
    dueDate.setDate(dueDate.getDate() + rentalDuration);
  } else if (rentalType === "weekly") {
    dueDate.setDate(dueDate.getDate() + rentalDuration * 7);
  } else {
    dueDate.setMonth(dueDate.getMonth() + rentalDuration);
  }

  return dueDate;
}

function buildReturnedRentalFees(rng, rentedAt, dueDate, book) {
  const returnedAt = new Date(
    rentedAt.getTime() + randomInt(rng, 4, 40) * 24 * 60 * 60 * 1000,
  );
  const overdueDays = Math.max(
    0,
    Math.ceil((returnedAt - dueDate) / (24 * 60 * 60 * 1000)),
  );
  const damageCondition = rng() > 0.9 ? "minor" : "good";
  const damageCharge = damageCondition === "minor" ? Math.round(book.replacementCost * 0.25) : 0;

  return {
    returnedAt,
    overdueDays,
    overdueCharge: overdueDays * book.pricePerDay,
    depositRefunded: Math.max(0, book.depositAmount - damageCharge),
    damageCharge,
    damageCondition,
    restrictionApplied: false,
  };
}

function buildFlaggedRentalFees(rng, dueDate, book) {
  const overdueDays = randomInt(rng, 1, 12);
  const damageCondition = rng() > 0.6 ? "major" : null;

  return {
    returnedAt: rng() > 0.5 ? new Date(dueDate.getTime() + overdueDays * 24 * 60 * 60 * 1000) : null,
    overdueDays,
    overdueCharge: overdueDays * book.pricePerDay,
    depositRefunded: 0,
    damageCharge: damageCondition === "major" ? Math.round(book.replacementCost * 0.75) : 0,
    damageCondition,
    restrictionApplied: true,
  };
}

function buildRentals(users, books, count, rng) {
  const now = Date.now();
  const rentals = [];
  const activeCountByUser = new Map(users.map((user) => [String(user._id), 0]));
  let guard = 0;

  while (rentals.length < count) {
    guard += 1;

    if (guard > count * 100) {
      throw new Error("Unable to generate rental set with current constraints");
    }

    const user = pickOne(rng, users);
    const userId = String(user._id);
    const status = chooseRentalStatus(rng);
    const currentActive = activeCountByUser.get(userId) || 0;

    if (status === "active" && (currentActive >= user.maxRentalsAllowed || user.isSuspended)) {
      continue;
    }

    const book = pickOne(rng, books);
    const rentalType = pickOne(rng, ["daily", "weekly", "monthly"]);
    const rentalDuration =
      rentalType === "daily"
        ? randomInt(rng, 2, 14)
        : rentalType === "weekly"
          ? randomInt(rng, 1, 4)
          : randomInt(rng, 1, 3);
    const rentedAt = new Date(now - randomInt(rng, 1, 160) * 24 * 60 * 60 * 1000);
    const dueDate = getDueDate(rentedAt, rentalType, rentalDuration);
    const rentalDays = getRentalDays(rentalType, rentalDuration);
    const feeState =
      status === "returned"
        ? buildReturnedRentalFees(rng, rentedAt, dueDate, book)
        : status === "flagged"
          ? buildFlaggedRentalFees(rng, dueDate, book)
          : {
              returnedAt: null,
              overdueDays: 0,
              overdueCharge: 0,
              depositRefunded: 0,
              damageCharge: 0,
              damageCondition: null,
              restrictionApplied: false,
            };

    rentals.push({
      user: user._id,
      book: book._id,
      rentalType,
      rentalDuration,
      totalRentPrice: book.pricePerDay * rentalDays,
      depositAmount: book.depositAmount,
      status,
      rentedAt,
      dueDate,
      ...feeState,
      lastOverdueChargeAt: status === "active" ? null : dueDate,
    });

    if (ACTIVE_STATUSES.has(status)) {
      activeCountByUser.set(userId, currentActive + 1);
    }
  }

  return rentals;
}

module.exports = {
  ACTIVE_STATUSES,
  buildRentals,
};
