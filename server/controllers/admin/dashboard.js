const Book = require("../../models/Book.js");
const User = require("../../models/User.js");
const Rental = require("../../models/Rental.js");
const Review = require("../../models/Review.js");

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 */
async function getDashboardStats(req, res) {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });
    const activeRentals = await Rental.countDocuments({ status: "active" });
    const totalReviews = await Review.countDocuments();
    const suspendedUsers = await User.countDocuments({ isSuspended: true });

    return res.status(200).json({
      totalBooks,
      totalUsers,
      activeRentals,
      totalReviews,
      suspendedUsers,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({ error: "Unable to fetch dashboard stats" });
  }
}

module.exports = { getDashboardStats };
