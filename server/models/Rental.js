const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
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
    rentalFee: {
      type: Number,
      required: true,
      min: 0,
    },
    depositAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    rentedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    damageCondition: {
      type: String,
      enum: ["good", "minor", "major", "lost", null],
      default: null,
    },
    damagePercentage: {
      type: Number,
      default: null,
      min: 0,
      max: 1,
    },
    damageCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    depositRefunded: {
      type: Number,
      default: 0,
      min: 0,
    },
    overdueDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    overdueCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastOverdueChargeAt: {
      type: Date,
      default: null,
    },
    restrictionApplied: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "returned", "overdue", "flagged"],
      default: "active",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

rentalSchema.index({ user: 1, status: 1, dueDate: 1 });
rentalSchema.index({ book: 1, status: 1 });

const Rental = mongoose.models.Rental || mongoose.model("Rental", rentalSchema);

module.exports = Rental;
