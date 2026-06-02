const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth.js");

// Import admin controllers
const { getDashboardStats } = require("../controllers/admin/dashboard.js");
const {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/admin/books.js");
const {
  getAllUsers,
  toggleUserSuspension,
  assignRole,
} = require("../controllers/admin/users.js");
const {
  getAllRentals,
  forceReturn,
} = require("../controllers/admin/rentals.js");
const {
  getAllReviews,
  deleteReview,
  getReviewStats,
} = require("../controllers/admin/reviews.js");

// Keep legacy search users import for backward compatibility
const { searchUsers } = require("../controllers/admin/searchUsers.js");

const router = express.Router();

// Dashboard
router.get("/dashboard", requireAuth, requireAdmin, getDashboardStats);

// Books Management
router.get("/books", requireAuth, requireAdmin, getAllBooks);
router.post("/books", requireAuth, requireAdmin, addBook);
router.put("/books/:id", requireAuth, requireAdmin, updateBook);
router.delete("/books/:id", requireAuth, requireAdmin, deleteBook);

// Users Management
router.get("/users", requireAuth, requireAdmin, getAllUsers);
router.put("/users/:id/suspend", requireAuth, requireAdmin, toggleUserSuspension);
router.put("/users/:id/role", requireAuth, requireAdmin, assignRole);

// Rentals Management
router.get("/rentals", requireAuth, requireAdmin, getAllRentals);
router.put("/rentals/:id/force-return", requireAuth, requireAdmin, forceReturn);

// Reviews Management
router.get("/reviews", requireAuth, requireAdmin, getAllReviews);
router.delete("/reviews/:id", requireAuth, requireAdmin, deleteReview);
router.get("/reviews/stats", requireAuth, requireAdmin, getReviewStats);

module.exports = router;
