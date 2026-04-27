require("dotenv").config();
const connectDB = require("../config/db.js");
const User = require("../models/User.js");
const Book = require("../models/Book.js");
const Wallet = require("../models/Wallet.js");
const Rental = require("../models/Rental.js");

async function backfillUsers() {
  const result = await User.updateMany(
    {},
    {
      $set: {
        walletBalanceCache: 0,
        pendingDuesTotal: 0,
        isFlagged: false,
        depositAmount: 0,
        depositStatus: "pending",
        maxRentalsAllowed: 3,
        isSuspended: false,
      },
    },
  );

  await User.updateMany(
    {
      $or: [{ activeRentalsCount: { $exists: false } }, { activeRentalsCount: null }],
    },
    { $set: { activeRentalsCount: 0 } },
  );

  return result;
}

async function backfillBooks() {
  const result = await Book.updateMany({}, [
    {
      $set: {
        pricePerDay: {
          $ifNull: [
            "$pricePerDay",
            {
              $max: [20, { $round: [{ $divide: [{ $ifNull: ["$rentPrice", { $ifNull: ["$price", 0] }] }, 18] }, 2] }],
            },
          ],
        },
        pricePerWeek: {
          $ifNull: [
            "$pricePerWeek",
            {
              $max: [120, { $round: [{ $multiply: [{ $divide: [{ $ifNull: ["$rentPrice", { $ifNull: ["$price", 0] }] }, 18] }, 6] }, 2] }],
            },
          ],
        },
        pricePerMonth: {
          $ifNull: [
            "$pricePerMonth",
            {
              $max: [360, { $round: [{ $multiply: [{ $divide: [{ $ifNull: ["$rentPrice", { $ifNull: ["$price", 0] }] }, 18] }, 20] }, 2] }],
            },
          ],
        },
        depositAmount: {
          $ifNull: ["$depositAmount", { $ifNull: ["$depositRequired", 0] }],
        },
        replacementCost: {
          $ifNull: [
            "$replacementCost",
            {
              $max: [
                { $ifNull: ["$depositRequired", 0] },
                { $round: [{ $ifNull: ["$rentPrice", { $ifNull: ["$price", 0] }] }, 0] },
              ],
            },
          ],
        },
        averageRating: {
          $ifNull: ["$averageRating", 0],
        },
        totalReviews: {
          $ifNull: ["$totalReviews", 0],
        },
        isAvailable: {
          $ifNull: ["$isAvailable", true],
        },
        unavailabilityReason: {
          $ifNull: ["$unavailabilityReason", "none"],
        },
      },
    },
    {
      $unset: ["price", "rentPrice", "depositRequired", "penaltyPerDay"],
    },
  ]);

  return result;
}

async function backfillWallets() {
  const users = await User.find({}).select("_id walletBalanceCache").lean();
  const bulk = users.map((user) => ({
    updateOne: {
      filter: { user: user._id },
      update: {
        $setOnInsert: {
          user: user._id,
          balance: user.walletBalanceCache || 0,
          lastUpdated: new Date(),
        },
      },
      upsert: true,
    },
  }));

  if (bulk.length === 0) {
    return { upsertedCount: 0 };
  }

  return Wallet.bulkWrite(bulk);
}

async function backfillRentals() {
  const result = await Rental.updateMany({}, [
    {
      $set: {
        rentalType: {
          $ifNull: ["$rentalType", "daily"],
        },
        rentalDuration: {
          $ifNull: ["$rentalDuration", 7],
        },
        rentalFee: {
          $ifNull: ["$rentalFee", { $ifNull: ["$penaltyAmount", 0] }],
        },
        depositAmount: {
          $ifNull: ["$depositAmount", 0],
        },
        rentedAt: {
          $ifNull: ["$rentedAt", "$startDate"],
        },
        returnedAt: {
          $ifNull: ["$returnedAt", "$returnedDate"],
        },
        damageCharge: {
          $ifNull: ["$damageCharge", 0],
        },
        overdueCharge: {
          $ifNull: ["$overdueCharge", { $ifNull: ["$penaltyAmount", 0] }],
        },
        depositRefunded: {
          $cond: {
            if: { $eq: [{ $type: "$depositRefunded" }, "bool"] },
            then: {
              $cond: {
                if: "$depositRefunded",
                then: { $ifNull: ["$depositAmount", 0] },
                else: 0,
              },
            },
            else: { $ifNull: ["$depositRefunded", 0] },
          },
        },
        status: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "penalised"] }, then: "flagged" },
            ],
            default: "$status",
          },
        },
        restrictionApplied: {
          $ifNull: ["$restrictionApplied", false],
        },
      },
    },
    {
      $unset: ["startDate", "returnedDate", "penaltyAmount", "penaltyPaid"],
    },
  ]);

  return result;
}

async function run() {
  try {
    await connectDB();

    const [userResult, bookResult, walletResult, rentalResult] = await Promise.all([
      backfillUsers(),
      backfillBooks(),
      backfillWallets(),
      backfillRentals(),
    ]);

    console.log("Backfill completed successfully.");
    console.log(`Users matched: ${userResult.matchedCount}, modified: ${userResult.modifiedCount}`);
    console.log(`Books matched: ${bookResult.matchedCount}, modified: ${bookResult.modifiedCount}`);
    console.log(`Wallet upserts: ${walletResult.upsertedCount || 0}`);
    console.log(`Rentals matched: ${rentalResult.matchedCount}, modified: ${rentalResult.modifiedCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Backfill failed:", error);
    process.exit(1);
  }
}

run();
