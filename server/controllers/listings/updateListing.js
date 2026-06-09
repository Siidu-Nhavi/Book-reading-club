const {
  normalizeListingPayload,
  validateListingPayload,
  buildListingPricing,
  findOwnedListing,
} = require("./helpers.js");

async function updateListing(req, res) {
  const { id } = req.params;
  const existingListing = await findOwnedListing({ id, userId: req.user._id });

  if (!existingListing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  const payload = normalizeListingPayload(req.body);
  const validationError = validateListingPayload(payload);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const rentPrice = Number.parseFloat(payload.rentPrice);
    const pricing = buildListingPricing(rentPrice, payload.category);

    existingListing.title = payload.title;
    existingListing.author = payload.author;
    existingListing.description = payload.description;
    existingListing.category = payload.category;
    existingListing.image = payload.image;
    existingListing.rentPrice = pricing.rentPrice;
    existingListing.pricePerDay = pricing.pricePerDay;
    existingListing.depositAmount = pricing.depositAmount;
    existingListing.replacementCost = pricing.replacementCost;
    existingListing.listingStatus = "active";
    existingListing.listedAt = existingListing.listedAt || new Date();
    existingListing.isAvailable = true;
    existingListing.unavailabilityReason = "none";

    await existingListing.save();

    return res.status(200).json({
      message: "Book listing updated successfully",
      listing: existingListing,
    });
  } catch (error) {
    console.error("Update listing error:", error);
    return res.status(500).json({ error: "Unable to update listing" });
  }
}

module.exports = { updateListing };
