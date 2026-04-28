const User = require("../models/User.js");

/**
 * Verify user is admin
 * Used in combination with requireAuth middleware
 */
const requireAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

module.exports = { requireAdmin };
