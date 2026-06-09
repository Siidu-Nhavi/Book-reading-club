const { findOwnedListing } = require("./helpers.js");

async function deleteListing(req, res) {
  const { id } = req.params;
  const listing = await findOwnedListing({ id, userId: req.user._id });

  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  try {
    listing.listingStatus = "removed";
    listing.isAvailable = false;
    listing.unavailabilityReason = "lost";

    await listing.save();

    return res.status(200).json({
      message: "Book listing removed successfully",
      listing,
    });
  } catch (error) {
    console.error("Delete listing error:", error);
    return res.status(500).json({ error: "Unable to remove listing" });
  }
}

module.exports = { deleteListing };
