const Book = require("../../models/Book.js");

async function getMyListings(req, res) {
  try {
    const listings = await Book.find({
      listedBy: req.user._id,
      listingStatus: { $ne: "removed" },
    })
      .sort({ listedAt: -1, createdAt: -1 })
      .select(
        "_id listedBy listedAt listingStatus title author description category rentPrice pricePerDay depositAmount replacementCost isAvailable unavailabilityReason averageRating totalReviews image createdAt updatedAt",
      );

    return res.status(200).json({
      total: listings.length,
      listings,
    });
  } catch (error) {
    console.error("Get my listings error:", error);
    return res.status(500).json({ error: "Unable to fetch listings" });
  }
}

module.exports = { getMyListings };
