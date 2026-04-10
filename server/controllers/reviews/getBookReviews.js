const mongoose = require("mongoose");
const Book = require("../../models/Book.js");
const Review = require("../../models/Review.js");

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

async function getBookReviews(req, res) {
  const { bookId } = req.params;

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: "A valid book id is required" });
  }

  const page = toPositiveInteger(req.query.page, 1);
  const requestedLimit = toPositiveInteger(req.query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const sortBy = req.query.sortBy === "rating" ? "rating" : "createdAt";
  const sort = { [sortBy]: -1 };

  try {
    const filters = { book: bookId };

    const [book, reviews, totalReviews] = await Promise.all([
      Book.findById(bookId).select("averageRating"),
      Review.find(filters)
        .populate("user", "name profile.avatarUrl")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.countDocuments(filters),
    ]);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const normalizedReviews = reviews.map((review) => ({
      user: {
        name: review.user?.name || "Unknown",
      },
      rating: review.rating,
      reviewText: review.reviewText,
      isVerified: review.isVerified,
      createdAt: review.createdAt,
    }));

    return res.status(200).json({
      averageRating: book.averageRating || 0,
      total: totalReviews,
      reviews: normalizedReviews,
    });
  } catch (error) {
    console.error("Get book reviews error:", error);
    return res.status(500).json({ error: "Unable to fetch reviews" });
  }
}

module.exports = { getBookReviews };
