const express = require("express");
const { register } = require("../controllers/auth/register.js");
const { login } = require("../controllers/auth/login.js");
const { logout } = require("../controllers/auth/logout.js");
const { requireAuth } = require("../middleware/auth.js");

const router = express.Router();

// register route
router.post("/register", register);
router.post("/login", login);
router.post("/logout", requireAuth, logout);

module.exports = router;
