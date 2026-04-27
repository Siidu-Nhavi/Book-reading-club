const DAY_IN_MS = 24 * 60 * 60 * 1000;

function roundCurrency(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function getRentalFee(book, rentalType, rentalDuration) {
  if (!book) {
    throw new Error("Book is required for pricing");
  }

  if (!Number.isInteger(rentalDuration) || rentalDuration < 1) {
    throw new Error("Rental duration must be a positive integer");
  }

  switch (rentalType) {
    case "daily":
      return roundCurrency(book.pricePerDay * rentalDuration);
    case "weekly":
      return roundCurrency(book.pricePerWeek * rentalDuration);
    case "monthly":
      return roundCurrency(book.pricePerMonth * rentalDuration);
    default:
      throw new Error("Invalid rental type");
  }
}

function getDueDate(rentedAt, rentalType, rentalDuration) {
  const dueDate = new Date(rentedAt);

  if (rentalType === "daily") {
    dueDate.setDate(dueDate.getDate() + rentalDuration);
    return dueDate;
  }

  if (rentalType === "weekly") {
    dueDate.setDate(dueDate.getDate() + rentalDuration * 7);
    return dueDate;
  }

  if (rentalType === "monthly") {
    dueDate.setMonth(dueDate.getMonth() + rentalDuration);
    return dueDate;
  }

  throw new Error("Invalid rental type");
}

function getOverdueDays(now, dueDate) {
  const current = new Date(now);
  const due = new Date(dueDate);
  const difference = current.getTime() - due.getTime();

  if (difference <= 0) {
    return 0;
  }

  return Math.ceil(difference / DAY_IN_MS);
}

module.exports = {
  DAY_IN_MS,
  roundCurrency,
  getRentalFee,
  getDueDate,
  getOverdueDays,
};
