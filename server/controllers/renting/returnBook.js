const mongoose = require("mongoose");
const { processReturn } = require("../../services/rentalFinanceService.js");
const Rental = require("../../models/Rental.js");
const Review = require("../../models/Review.js");
const { syncBookRating } = require("../reviews/reviewHelpers.js");

async function returnBook(req, res) {
  const rentalId = req.params.id || req.body.rentalId;
  const condition = String(req.body.condition || "good").trim().toLowerCase();
  const damagePercentageRaw = req.body.damagePercentage;
  const adminNote = String(req.body.adminNote || "").trim();
  const reviewRating = req.body.rating;
  const reviewText = String(req.body.reviewText || "").trim();

  if (!rentalId || !mongoose.Types.ObjectId.isValid(rentalId)) {
    return res.status(400).json({ error: "A valid rental id is required" });
  }

  if (!["good", "minor", "major", "lost"].includes(condition)) {
    return res.status(400).json({ error: "condition must be good, minor, major, or lost" });
  }

  const damagePercentage =
    damagePercentageRaw === undefined || damagePercentageRaw === null || damagePercentageRaw === ""
      ? null
      : Number(damagePercentageRaw);

  try {
    const rental = await Rental.findById(rentalId).select("user book status");

    if (!rental) {
      return res.status(404).json({ error: "Rental not found" });
    }

    const isOwner = String(rental.user) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "You cannot return this rental" });
    }

    if (isOwner) {
      if (condition !== "good") {
        return res.status(403).json({ error: "Users can only submit standard good-condition returns" });
      }

      const normalizedRating = Number(reviewRating);

      if (!Number.isFinite(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }

      const existingReview = await Review.findOne({
        user: req.user._id,
        book: rental.book,
      });

      if (!existingReview) {
        await Review.create({
          user: req.user._id,
          book: rental.book,
          rental: rentalId,
          rating: normalizedRating,
          reviewText,
          isVerified: true,
        });

        await syncBookRating(rental.book);
      }
    }

    const result = await processReturn({
      rentalId,
      condition,
      damagePercentage,
      adminNote,
    });

    if (!result.ok) {
      return res.status(result.status || 400).json({ error: result.message });
    }

    return res.status(200).json({
      message: "Return processed successfully",
      returnSummary: {
        rentalId: result.rentalId,
        returnedAt: result.returnedAt,
        status: result.status,
        condition: result.condition,
        damageCharge: result.damageCharge,
        depositRefund: result.depositRefund,
        extraWalletDeduction: result.extraWalletDeduction,
        pendingDue: result.pendingDue
          ? {
              _id: result.pendingDue._id,
              amount: result.pendingDue.amount,
              reason: result.pendingDue.reason,
            }
          : null,
        depositHeld: result.depositHeld,
        depositReleasedNow: result.depositReleasedNow,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: "You have already reviewed this book" });
    }
    console.error("Return book error:", error);
    return res.status(500).json({ error: "Unable to process return" });
  }
}

module.exports = { returnBook };
