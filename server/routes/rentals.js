const express = require("express");
const { getMyRentals } = require("../controllers/renting/getMyRentals.js");
const { getAllRentalsAdmin } = require("../controllers/renting/getAllRentalsAdmin.js");
const { rentBook, previewRental } = require("../controllers/renting/rentBook.js");
const { returnBook } = require("../controllers/renting/returnBook.js");
const { requireAdmin, requireAuth, requireNotSuspended } = require("../middleware/auth.js");

const router = express.Router();

router.get("/preview", requireAuth, previewRental);
router.get("/my-rentals", requireAuth, getMyRentals);
router.get("/my", requireAuth, getMyRentals);
router.get("/all", requireAuth, requireAdmin, getAllRentalsAdmin);
router.post("/reserve", requireAuth, requireNotSuspended, rentBook);
router.post("/create", requireAuth, requireNotSuspended, rentBook);
router.post("/rent", requireAuth, requireNotSuspended, rentBook);
router.post("/:id/return", requireAuth, returnBook);
router.post("/return", requireAuth, returnBook);

module.exports = router;
