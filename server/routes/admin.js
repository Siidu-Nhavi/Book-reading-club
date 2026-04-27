const express = require("express");
const { searchUsers } = require("../controllers/admin/searchUsers.js");
const { requireAdmin, requireAuth } = require("../middleware/auth.js");

const router = express.Router();

router.get("/users", requireAuth, requireAdmin, searchUsers);

module.exports = router;
