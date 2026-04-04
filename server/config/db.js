const mongoose = require("mongoose");

async function connectDB() {
  const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/BookNest";

  await mongoose.connect(mongoUrl);
  console.log("Connected to MongoDB");
}

module.exports = connectDB;
