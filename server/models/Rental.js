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
    status: {
      type: String,
      enum: ["active", "returned", "overdue", "penalised"],
      default: "active",
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    returnedDate: {
      type: Date,
      default: null,
    },
    overdueDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    penaltyAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    penaltyPaid: {
      type: Boolean,
      default: false,
    },
    depositRefunded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

rentalSchema.index({ user: 1, status: 1, dueDate: 1 });
rentalSchema.index({ book: 1, status: 1 });

const Rental = mongoose.models.Rental || mongoose.model("Rental", rentalSchema);

module.exports = Rental;
