const mongoose = require("mongoose");
const Book = require("../../models/Book.js");
const { calculateBookPricing } = require("../../utils/categoryPricing.js");

function normalizeListingPayload(body = {}) {
  return {
    title: String(body.title || "").trim(),
    author: String(body.author || "").trim(),
    description: String(body.description || "").trim(),
    category: String(body.category || "").trim(),
    image: String(body.image || "").trim(),
    rentPrice: body.rentPrice,
  };
}

function validateListingPayload(payload = {}) {
  const requiredFields = ["title", "author", "description", "category", "image"];
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }

  const parsedRentPrice = Number.parseFloat(payload.rentPrice);

  if (!Number.isFinite(parsedRentPrice) || parsedRentPrice <= 0) {
    return "rentPrice must be a positive number";
  }

  return "";
}

function buildListingPricing(rentPrice, category) {
  return calculateBookPricing({
    basePrice: rentPrice,
    category,
  });
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function findOwnedListing({ id, userId }) {
  if (!isValidObjectId(id)) {
    return null;
  }

  return Book.findOne({
    _id: id,
    listedBy: userId,
    listingStatus: { $ne: "removed" },
  });
}

module.exports = {
  normalizeListingPayload,
  validateListingPayload,
  buildListingPricing,
  findOwnedListing,
  isValidObjectId,
};
