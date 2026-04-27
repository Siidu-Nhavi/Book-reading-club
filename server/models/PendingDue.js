const mongoose = require("mongoose");

const pendingDueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental",
      default: null,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      enum: ["damage_charge", "overdue_charge", "lost_charge"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "cleared"],
      default: "pending",
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

pendingDueSchema.index({ user: 1, status: 1, createdAt: -1 });

const PendingDue = mongoose.models.PendingDue || mongoose.model("PendingDue", pendingDueSchema);

module.exports = PendingDue;
