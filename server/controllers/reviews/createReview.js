const mongoose = require("mongoose");
const Book = require("../../models/Book.js");
const Rental = require("../../models/Rental.js");
const Review = require("../../models/Review.js");

async function syncBookRating(bookId) {
  const [stats] = await Review.aggregate([
    { $match: { book: new mongoose.Types.ObjectId(bookId) } },
    {
      $group: {
        _id: "$book",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const averageRating = stats?.averageRating || 0;
  const totalReviews = stats?.totalReviews || 0;

  await Book.updateOne(
    { _id: bookId },
    {
      $set: {
        averageRating: Number(averageRating.toFixed(2)),
        totalReviews,
      },
    },
  );
}

async function createReview(req, res) {
  const { bookId, rentalId, rating, reviewText = "" } = req.body;

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: "A valid bookId is required" });
  }

  if (!rentalId || !mongoose.Types.ObjectId.isValid(rentalId)) {
    return res.status(400).json({ error: "A valid rentalId is required" });
  }

  const normalizedRating = Number(rating);

  if (!Number.isFinite(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    const rental = await Rental.findOne({
      _id: rentalId,
      user: req.user._id,
      book: bookId,
    });

    if (!rental) {
      return res.status(404).json({
        error: "Matching rental not found for this user and book",
      });
    }

    if (rental.status !== "returned") {
      return res.status(400).json({
        error: "You can only review a returned rental",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rental: rentalId,
      rating: normalizedRating,
      reviewText: String(reviewText).trim(),
      isVerified: true,
    });

    await syncBookRating(bookId);

    return res.status(201).json({
      message: "Review submitted",
      review: {
        _id: review._id,
        rating: review.rating,
        isVerified: review.isVerified,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        error: "You have already reviewed this book",
      });
    }

    console.error("Create review error:", error);
    return res.status(500).json({ error: "Unable to add review" });
  }
}

module.exports = { createReview };
