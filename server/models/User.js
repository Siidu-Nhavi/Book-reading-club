const mongoose = require("mongoose");
const profileSchema = require("./Profile.js");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    depositAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    depositStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    activeRentalsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxRentalsAllowed: {
      type: Number,
      default: 3,
      min: 1,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: profileSchema,
      default: () => ({}),
    },
    accountSettings: {
      emailOrderUpdates: {
        type: Boolean,
        default: true,
      },
      emailRecommendations: {
        type: Boolean,
        default: true,
      },
      pushFlashDeals: {
        type: Boolean,
        default: false,
      },
      smsDeliveryAlerts: {
        type: Boolean,
        default: true,
      },
      oneClickCheckout: {
        type: Boolean,
        default: false,
      },
      saveCardsForFasterCheckout: {
        type: Boolean,
        default: true,
      },
      defaultDeliveryType: {
        type: String,
        enum: ["home", "pickup", "smart-locker"],
        default: "home",
      },
      twoFactorAuth: {
        type: Boolean,
        default: false,
      },
      allowNewDeviceLogin: {
        type: Boolean,
        default: true,
      },
      marketingPersonalization: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
