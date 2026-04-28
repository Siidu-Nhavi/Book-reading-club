const Rental = require("../../models/Rental.js");
const User = require("../../models/User.js");
const Book = require("../../models/Book.js");

/**
 * GET /api/admin/rentals
 * Get all rentals with optional filters and pagination
 */
async function getAllRentals(req, res) {
  try {
    const { page = 1, limit = 10, status = "", search = "" } = req.query;
    const skip = (page - 1) * limit;

    const searchFilter = {};

    if (status && status !== "all") {
      searchFilter.status = status;
    }

    if (search) {
      // Search by user email or book title
      const users = await User.find({ email: { $regex: search, $options: "i" } }).select("_id");
      const userIds = users.map((u) => u._id);
      const books = await Book.find({ title: { $regex: search, $options: "i" } }).select("_id");
      const bookIds = books.map((b) => b._id);

      searchFilter.$or = [{ user: { $in: userIds } }, { book: { $in: bookIds } }];
    }

    const rentals = await Rental.find(searchFilter)
      .populate("user", "name email")
      .populate("book", "title author image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Rental.countDocuments(searchFilter);

    return res.status(200).json({
      rentals,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get rentals error:", error);
    return res.status(500).json({ error: "Unable to fetch rentals" });
  }
}

/**
 * PUT /api/admin/rentals/:id/force-return
 * Force return a rental
 */
async function forceReturn(req, res) {
  try {
    const { id } = req.params;
    const { damageLevel = "none", damageCost = 0 } = req.body;

    if (!["none", "minor", "moderate", "severe"].includes(damageLevel)) {
      return res.status(400).json({ error: "Invalid damage level" });
    }

    const rental = await Rental.findByIdAndUpdate(
      id,
      {
        status: "returned",
        returnedDate: new Date(),
        damageLevel,
        damageCost: parseFloat(damageCost) || 0,
        updatedAt: new Date(),
      },
      { new: true }
    )
      .populate("user", "name email")
      .populate("book", "title");

    if (!rental) {
      return res.status(404).json({ error: "Rental not found" });
    }

    // Update book availability
    await Book.findByIdAndUpdate(rental.book._id, {
      $inc: { availableCopies: 1 },
    });

    return res.status(200).json({
      message: "Rental forced returned successfully",
      rental,
    });
  } catch (error) {
    console.error("Force return error:", error);
    return res.status(500).json({ error: "Unable to force return rental" });
  }
}

module.exports = {
  getAllRentals,
  forceReturn,
};
