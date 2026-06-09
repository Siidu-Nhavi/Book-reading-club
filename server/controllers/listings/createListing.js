const Book = require("../../models/Book.js");
const {
  normalizeListingPayload,
  validateListingPayload,
  buildListingPricing,
} = require("./helpers.js");

async function createListing(req, res) {
  const payload = normalizeListingPayload(req.body);
  const validationError = validateListingPayload(payload);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const rentPrice = Number.parseFloat(payload.rentPrice);
    const pricing = buildListingPricing(rentPrice, payload.category);

    const book = await Book.create({
      listedBy: req.user._id,
      listedAt: new Date(),
      listingStatus: "active",
      title: payload.title,
      author: payload.author,
      description: payload.description,
      category: payload.category,
      image: payload.image,
      rentPrice: pricing.rentPrice,
      pricePerDay: pricing.pricePerDay,
      depositAmount: pricing.depositAmount,
      replacementCost: pricing.replacementCost,
      isAvailable: true,
      unavailabilityReason: "none",
    });

    return res.status(201).json({
      message: "Book listing created successfully",
      listing: book,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    return res.status(500).json({ error: "Unable to create listing" });
  }
}

module.exports = { createListing };
