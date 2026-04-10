// book schema
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
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
    depositRequired: {
      type: Number,
      default: 0,
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
    penaltyPerDay: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);


const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);

module.exports = Book;