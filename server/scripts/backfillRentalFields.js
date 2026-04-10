require("dotenv").config();
const connectDB = require("../config/db.js");
const User = require("../models/User.js");
const Book = require("../models/Book.js");

async function backfillUsers() {
  const result = await User.updateMany(
    {},
    {
      $set: {
        depositAmount: 0,
        depositStatus: "pending",
        maxRentalsAllowed: 3,
        isSuspended: false,
      },
    },
  );

  await User.updateMany(
    {
      $or: [
        { activeRentalsCount: { $exists: false } },
        { activeRentalsCount: null },
      ],
    },
    { $set: { activeRentalsCount: 0 } },
  );

  return result;
}

async function backfillBooks() {
  const result = await Book.updateMany({}, [
    {
      $set: {
        rentPrice: { $ifNull: ["$rentPrice", { $ifNull: ["$price", 0] }] },
        depositRequired: {
          $ifNull: ["$depositRequired", 0],
        },
        penaltyPerDay: {
          $ifNull: ["$penaltyPerDay", 0],
        },
        averageRating: {
          $ifNull: ["$averageRating", 0],
        },
        totalReviews: {
          $ifNull: ["$totalReviews", 0],
        },
      },
    },
    {
      $unset: ["price"],
    },
  ]);

  return result;
}

async function run() {
  try {
    await connectDB();

    const userResult = await backfillUsers();
    const bookResult = await backfillBooks();

    console.log("Backfill completed successfully.");
    console.log(
      `Users matched: ${userResult.matchedCount}, modified: ${userResult.modifiedCount}`,
    );
    console.log(
      `Books matched: ${bookResult.matchedCount}, modified: ${bookResult.modifiedCount}`,
    );

    process.exit(0);
  } catch (error) {
    console.error("Backfill failed:", error);
    process.exit(1);
  }
}

run();
