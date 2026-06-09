const Book = require("../../models/Book");
const Rental = require("../../models/Rental");
const Review = require("../../models/Review");
const User = require("../../models/User");
const { ACTIVE_STATUSES } = require("./rentals");

async function syncDerivedFields() {
  const [reviewStats, activeRentalStats] = await Promise.all([
    Review.aggregate([
      {
        $group: {
          _id: "$book",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]),
    Rental.aggregate([
      {
        $match: {
          status: { $in: Array.from(ACTIVE_STATUSES) },
        },
      },
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  await Promise.all([
    Book.updateMany(
      {},
      { $set: { averageRating: 0, totalReviews: 0, isAvailable: true, unavailabilityReason: "none" } },
    ),
    User.updateMany({}, { $set: { activeRentalsCount: 0 } }),
  ]);

  if (reviewStats.length > 0) {
    await Book.bulkWrite(
      reviewStats.map((stat) => ({
        updateOne: {
          filter: { _id: stat._id },
          update: {
            $set: {
              averageRating: Number(stat.averageRating.toFixed(2)),
              totalReviews: stat.totalReviews,
            },
          },
        },
      })),
    );
  }

  if (activeRentalStats.length === 0) {
    return;
  }

  await User.bulkWrite(
    activeRentalStats.map((stat) => ({
      updateOne: {
        filter: { _id: stat._id },
        update: { $set: { activeRentalsCount: stat.count } },
      },
    })),
  );

  const activeBookIds = await Rental.distinct("book", {
    status: { $in: Array.from(ACTIVE_STATUSES) },
  });

  if (activeBookIds.length > 0) {
    await Book.updateMany(
      { _id: { $in: activeBookIds } },
      { $set: { isAvailable: false, unavailabilityReason: "rented" } },
    );
  }
}

module.exports = {
  syncDerivedFields,
};
