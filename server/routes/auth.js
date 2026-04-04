const express = require("express");
const { register } = require("../controllers/auth/register.js");
const { login } = require("../controllers/auth/login.js");

const router = express.Router();

//register route
router.post("/register", register);
router.post("/login", login);

module.exports = router;
