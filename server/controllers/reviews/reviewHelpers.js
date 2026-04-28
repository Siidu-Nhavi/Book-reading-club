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

module.exports = {
  syncBookRating,
};
