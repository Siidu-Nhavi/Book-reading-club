const express = require("express");
const { getCurrentUser } = require("../controllers/user/getCurrentUser.js");
const { updateProfile } = require("../controllers/user/updateProfile.js");
const { requireAuth } = require("../middleware/auth.js");

const router = express.Router();

router.get("/me", requireAuth, getCurrentUser);
router.put("/me", requireAuth, updateProfile);

module.exports = router;
