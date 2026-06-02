const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
    rentalType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },
    rentalDuration: {
      type: Number,
      required: true,
      min: 1,
    },
    totalRentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    depositAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentCurrency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    paymentIntentId: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    status: {
      type: String,
      enum: ["reserved", "confirmed", "expired", "canceled"],
      default: "reserved",
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    rental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental",
      default: null,
    },
    idempotencyKey: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
  },
  { timestamps: true },
);

reservationSchema.index({ book: 1, status: 1, expiresAt: 1 });

const Reservation =
  mongoose.models.Reservation || mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
