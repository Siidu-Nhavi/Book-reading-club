const Review = require("../../models/Review.js");
const User = require("../../models/User.js");
const Book = require("../../models/Book.js");

/**
 * GET /api/admin/reviews
 * Get all reviews with optional filters and pagination
 */
async function getAllReviews(req, res) {
  try {
    const { page = 1, limit = 10, bookId = "", userId = "", minRating = 0 } = req.query;
    const skip = (page - 1) * limit;

    const searchFilter = {};

    if (minRating) {
      searchFilter.rating = { $gte: parseInt(minRating) };
    }

    if (bookId) {
      searchFilter.book = bookId;
    }

    if (userId) {
      searchFilter.user = userId;
    }

    const reviews = await Review.find(searchFilter)
      .populate("user", "name email")
      .populate("book", "title author")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments(searchFilter);

    return res.status(200).json({
      reviews,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return res.status(500).json({ error: "Unable to fetch reviews" });
  }
}

/**
 * DELETE /api/admin/reviews/:id
 * Delete a review
 */
async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id)
      .populate("user", "name")
      .populate("book", "title");

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    return res.status(200).json({
      message: "Review deleted successfully",
      review,
    });
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({ error: "Unable to delete review" });
  }
}

/**
 * GET /api/admin/reviews/stats
 * Get review statistics
 */
async function getReviewStats(req, res) {
  try {
    const totalReviews = await Review.countDocuments();
    const averageRating = await Review.aggregate([
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]);
    const ratingDistribution = await Review.aggregate([
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      totalReviews,
      averageRating: averageRating[0]?.avg || 0,
      ratingDistribution,
    });
  } catch (error) {
    console.error("Review stats error:", error);
    return res.status(500).json({ error: "Unable to fetch review stats" });
  }
}

module.exports = {
  getAllReviews,
  deleteReview,
  getReviewStats,
};
