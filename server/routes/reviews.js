const express = require("express");
const { createReview } = require("../controllers/reviews/createReview.js");
const { deleteReview } = require("../controllers/reviews/deleteReview.js");
const { getBookReviews } = require("../controllers/reviews/getBookReviews.js");
const { requireAuth } = require("../middleware/auth.js");

const router = express.Router();

router.get("/book/:bookId", getBookReviews);
router.post("/", requireAuth, createReview);
router.delete("/:id", requireAuth, deleteReview);

module.exports = router;
