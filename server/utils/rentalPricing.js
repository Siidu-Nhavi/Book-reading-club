const DAY_IN_MS = 24 * 60 * 60 * 1000;

function roundCurrency(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function getRentalDays(rentalType, rentalDuration) {
  if (!Number.isInteger(rentalDuration) || rentalDuration < 1) {
    throw new Error("Rental duration must be a positive integer");
  }

  switch (rentalType) {
    case "daily":
      return rentalDuration;
    case "weekly":
      return rentalDuration * 7;
    case "monthly":
      return rentalDuration * 30;
    default:
      throw new Error("Invalid rental type");
  }
}

function getTotalRentPrice(book, rentalType, rentalDuration) {
  if (!book) {
    throw new Error("Book is required for pricing");
  }

  const days = getRentalDays(rentalType, rentalDuration);
  return roundCurrency((book.pricePerDay || 0) * days);
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
  getRentalDays,
  getTotalRentPrice,
  getDueDate,
  getOverdueDays,
};
