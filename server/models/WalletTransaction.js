const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      enum: ["deposit_refund", "damage_charge", "top_up", "rental_fee", "overdue_charge"],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

walletTransactionSchema.index({ user: 1, createdAt: -1 });

const WalletTransaction =
  mongoose.models.WalletTransaction ||
  mongoose.model("WalletTransaction", walletTransactionSchema);

module.exports = WalletTransaction;
