const mongoose = require("mongoose");
const Book = require("../../models/Book.js");
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

async function deleteReview(req, res) {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "A valid review id is required" });
  }

  try {
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const isOwner = String(review.user) === String(req.user._id);

    if (!isOwner) {
      return res.status(403).json({ error: "You cannot delete this review" });
    }

    await Review.deleteOne({ _id: review._id });
    await syncBookRating(review.book);

    return res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({ error: "Unable to delete review" });
  }
}

module.exports = { deleteReview };
