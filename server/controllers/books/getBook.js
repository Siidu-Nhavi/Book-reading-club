const mongoose = require("mongoose");
const Book = require("../../models/Book.js");

async function getBook(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid book id" });
  }

  try {
    const book = await Book.findOne({ _id: id, listingStatus: { $ne: "removed" } });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error("Get book error:", error);
    return res.status(500).json({ error: "Unable to fetch book" });
  }
}

module.exports = { getBook };
