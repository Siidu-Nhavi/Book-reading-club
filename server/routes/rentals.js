const express = require("express");
const { getMyRentals } = require("../controllers/renting/getMyRentals.js");
const { rentBook } = require("../controllers/renting/rentBook.js");
const { returnBook } = require("../controllers/renting/returnBook.js");
const { requireAuth, requireNotSuspended } = require("../middleware/auth.js");

const router = express.Router();

router.get("/my", requireAuth, getMyRentals);
router.post("/rent", requireAuth, requireNotSuspended, rentBook);
router.post("/return", requireAuth, returnBook);

module.exports = router;
