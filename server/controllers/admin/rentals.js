const Rental = require("../../models/Rental.js");
const User = require("../../models/User.js");
const Book = require("../../models/Book.js");
const { processReturn } = require("../../services/rentalFinanceService.js");

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
    const { damageLevel = "none", damageCost = 0, adminNote = "" } = req.body;
    const normalizedDamage = String(damageLevel || "none").trim().toLowerCase();

    if (!["none", "minor", "moderate", "severe", "good", "major", "lost"].includes(normalizedDamage)) {
      return res.status(400).json({ error: "Invalid damage level" });
    }

    const rental = await Rental.findById(id).populate("book");

    if (!rental) {
      return res.status(404).json({ error: "Rental not found" });
    }

    const condition =
      normalizedDamage === "none" || normalizedDamage === "good"
        ? "good"
        : normalizedDamage === "minor"
          ? "minor"
          : normalizedDamage === "moderate" || normalizedDamage === "major"
            ? "major"
            : "lost";

    let damagePercentage = null;

    if (condition === "minor") {
      const replacementCost = Number(rental.book?.replacementCost || 0);
      const parsedDamageCost = Number(damageCost);

      if (Number.isFinite(parsedDamageCost) && parsedDamageCost > 0 && replacementCost > 0) {
        damagePercentage = Math.min(0.5, Math.max(0.25, parsedDamageCost / replacementCost));
      } else {
        damagePercentage = 0.25;
      }
    }

    const result = await processReturn({
      rentalId: id,
      condition,
      damagePercentage,
      adminNote: String(adminNote || "").trim(),
    });

    if (!result.ok) {
      return res.status(result.status || 400).json({ error: result.message });
    }

    const updatedRental = await Rental.findById(id)
      .populate("user", "name email")
      .populate("book", "title");

    return res.status(200).json({
      message: "Rental forced returned successfully",
      rental: updatedRental || rental,
      returnSummary: {
        rentalId: result.rentalId,
        returnedAt: result.returnedAt,
        status: result.status,
        condition: result.condition,
        damageCharge: result.damageCharge,
        depositRefund: result.depositRefund,
        extraWalletDeduction: result.extraWalletDeduction,
        pendingDue: result.pendingDue
          ? {
              _id: result.pendingDue._id,
              amount: result.pendingDue.amount,
              reason: result.pendingDue.reason,
            }
          : null,
        depositHeld: result.depositHeld,
        depositReleasedNow: result.depositReleasedNow,
      },
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
