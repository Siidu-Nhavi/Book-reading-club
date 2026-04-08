const mongoose = require("mongoose");
const Book = require("../../models/Book.js");

async function getBook(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book id" });
  }

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ book });
  } catch (error) {
    console.error("Get book error:", error);
    return res.status(500).json({ message: "Unable to fetch book" });
  }
}

module.exports = { getBook };
