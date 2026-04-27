const express = require("express");
const { checkOverdue } = require("../controllers/cron/checkOverdue.js");
const { requireAdmin, requireAuth } = require("../middleware/auth.js");

const router = express.Router();

router.post("/check-overdue", requireAuth, requireAdmin, checkOverdue);

module.exports = router;
