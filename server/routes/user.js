const express = require("express");
const { getCurrentUser } = require("../controllers/user/getCurrentUser.js");
const { requireAdmin, requireAuth } = require("../middleware/auth.js");

const router = express.Router();

router.get("/me", requireAuth, getCurrentUser);
router.get("/admin", requireAuth, requireAdmin, (req, res) => {
  return res.status(200).json({ message: "Admin access granted" });
});

module.exports = router;
