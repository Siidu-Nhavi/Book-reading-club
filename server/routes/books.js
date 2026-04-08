const express = require("express");
const { getAllBook } = require("../controllers/books/getAllBook.js");
const { getBookCategories } = require("../controllers/books/getBookCategories.js");
const { getBook } = require("../controllers/books/getBook.js");

const router = express.Router();

router.get("/", getAllBook);
router.get("/categories", getBookCategories);
router.get("/:id", getBook);

module.exports = router;
