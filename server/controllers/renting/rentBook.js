const mongoose = require("mongoose");
const { createRental, evaluateRentalEligibility } = require("../../services/rentalFinanceService.js");

const DURATION_LIMITS = {
  daily: { min: 1, max: 30 },
  weekly: { min: 1, max: 4 },
  monthly: { min: 1, max: 3 },
};

function normalizeRentalInput(body = {}) {
  const rentalType = String(body.rentalType || "daily").trim().toLowerCase();
  const rentalDuration = Number.parseInt(body.rentalDuration, 10);
  return { rentalType, rentalDuration };
}

function validateRentalInput({ rentalType, rentalDuration }) {
  if (!DURATION_LIMITS[rentalType]) {
    return "rentalType must be daily, weekly, or monthly";
  }

  const bounds = DURATION_LIMITS[rentalType];

  if (!Number.isInteger(rentalDuration) || rentalDuration < bounds.min || rentalDuration > bounds.max) {
    return `rentalDuration must be between ${bounds.min} and ${bounds.max} for ${rentalType} rentals`;
  }

  return "";
}

async function rentBook(req, res) {
  const { bookId } = req.body;

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: "A valid bookId is required" });
  }

  const rentalInput = normalizeRentalInput(req.body);
  const validationError = validateRentalInput(rentalInput);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const rentalResult = await createRental({
      userId: req.user._id,
      bookId,
      rentalType: rentalInput.rentalType,
      rentalDuration: rentalInput.rentalDuration,
    });

    if (!rentalResult.allowed) {
      return res.status(rentalResult.status || 400).json({ error: rentalResult.message });
    }

    return res.status(201).json({
      message: "Book rented successfully",
      rental: {
        _id: rentalResult.rental._id,
        book: rentalResult.rental.book,
        rentalType: rentalResult.rental.rentalType,
        rentalDuration: rentalResult.rental.rentalDuration,
        rentalFee: rentalResult.rental.rentalFee,
        depositAmount: rentalResult.rental.depositAmount,
        rentedAt: rentalResult.rental.rentedAt,
        dueDate: rentalResult.rental.dueDate,
        status: rentalResult.rental.status,
      },
      wallet: {
        chargedAmount: rentalResult.chargedAmount,
        balance: rentalResult.walletBalance,
      },
    });
  } catch (error) {
    console.error("Rent book error:", error);
    return res.status(500).json({ error: "Unable to rent book" });
  }
}

async function previewRental(req, res) {
  const { bookId } = req.query;

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: "A valid bookId is required" });
  }

  const rentalInput = normalizeRentalInput(req.query);
  const validationError = validateRentalInput(rentalInput);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const eligibility = await evaluateRentalEligibility({
      userId: req.user._id,
      bookId,
      rentalType: rentalInput.rentalType,
      rentalDuration: rentalInput.rentalDuration,
    });

    return res.status(200).json({
      allowed: Boolean(eligibility.allowed),
      message: eligibility.message || "",
      pricing: eligibility.allowed
        ? {
            rentalFee: eligibility.rentalFee,
            depositAmount: eligibility.depositAmount,
            total: eligibility.total,
            walletBalance: eligibility.wallet.balance,
            walletAfter: eligibility.wallet.balance - eligibility.total,
          }
        : {
            rentalFee: eligibility.rentalFee || 0,
            depositAmount: eligibility.depositAmount || 0,
            total: eligibility.total || 0,
            walletBalance: eligibility.walletBalance || 0,
            walletAfter: Math.max(0, (eligibility.walletBalance || 0) - (eligibility.total || 0)),
          },
    });
  } catch (error) {
    console.error("Preview rental error:", error);
    return res.status(500).json({ error: "Unable to preview rental" });
  }
}

module.exports = { rentBook, previewRental };
