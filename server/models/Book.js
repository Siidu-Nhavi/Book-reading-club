// book schema
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    listingStatus: {
      type: String,
      enum: ["active", "inactive", "removed"],
      default: "active",
      index: true,
    },
    listedAt: {
      type: Date,
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    rentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    depositAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    replacementCost: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      trim: true,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      required: true,
    },
    unavailabilityReason: {
      type: String,
      enum: ["none", "rented", "lost"],
      default: "none",
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);

module.exports = Book;

// middleware to calculate average rating and total reviews
bookSchema.pre("save", async function (next) {
  if (!this.isModified("averageRating") && !this.isModified("totalReviews")) {
    return next();
  }

  try {
    const Review = mongoose.model("Review");
    const reviews = await Review.find({ book: this._id });
    this.totalReviews = reviews.length;
    this.averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    next();
  } catch (err) {
    next(err);
  }
});