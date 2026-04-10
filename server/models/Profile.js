const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    avatarUrl: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
      maxlength: 280,
    },
    mobileNumber: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
      maxlength: 400,
    },
    city: {
      type: String,
      trim: true,
      default: "",
      maxlength: 120,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

module.exports = profileSchema;
