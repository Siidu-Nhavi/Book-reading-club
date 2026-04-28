const Book = require("../../models/Book.js");

/**
 * GET /api/admin/books
 * Get all books with optional search and pagination
 */
async function getAllBooks(req, res) {
  try {
    const { search = "", page = 1, limit = 10, sortBy = "newest" } = req.query;
    const skip = (page - 1) * limit;

    const searchFilter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const sortOptions = {};
    if (sortBy === "newest") sortOptions.createdAt = -1;
    if (sortBy === "oldest") sortOptions.createdAt = 1;
    if (sortBy === "titleAsc") sortOptions.title = 1;
    if (sortBy === "titleDesc") sortOptions.title = -1;

    const books = await Book.find(searchFilter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Book.countDocuments(searchFilter);

    return res.status(200).json({
      books,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get books error:", error);
    return res.status(500).json({ error: "Unable to fetch books" });
  }
}

/**
 * POST /api/admin/books
 * Add new book
 */
async function addBook(req, res) {
  try {
    const {
      title,
      author,
      description,
      category,
      image,
      dailyRentalPrice,
      weeklyRentalPrice,
      depositAmount,
      totalCopies,
      isbn,
      publisher,
      yearPublished,
    } = req.body;

    if (!title || !author || !category || !dailyRentalPrice || !depositAmount) {
      return res.status(400).json({
        error: "Missing required fields: title, author, category, dailyRentalPrice, depositAmount",
      });
    }

    const newBook = new Book({
      title,
      author,
      description: description || "",
      category,
      image: image || "",
      dailyRentalPrice: parseFloat(dailyRentalPrice),
      weeklyRentalPrice: parseFloat(weeklyRentalPrice) || parseFloat(dailyRentalPrice) * 5,
      depositAmount: parseFloat(depositAmount),
      totalCopies: parseInt(totalCopies) || 1,
      availableCopies: parseInt(totalCopies) || 1,
      isbn: isbn || "",
      publisher: publisher || "",
      yearPublished: parseInt(yearPublished) || new Date().getFullYear(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newBook.save();

    return res.status(201).json({
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    console.error("Add book error:", error);
    return res.status(500).json({ error: "Unable to add book" });
  }
}

/**
 * PUT /api/admin/books/:id
 * Update book details
 */
async function updateBook(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      description,
      category,
      image,
      dailyRentalPrice,
      weeklyRentalPrice,
      depositAmount,
      totalCopies,
      availableCopies,
      isbn,
      publisher,
      yearPublished,
    } = req.body;

    const book = await Book.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(author && { author }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(image !== undefined && { image }),
        ...(dailyRentalPrice && { dailyRentalPrice: parseFloat(dailyRentalPrice) }),
        ...(weeklyRentalPrice && { weeklyRentalPrice: parseFloat(weeklyRentalPrice) }),
        ...(depositAmount && { depositAmount: parseFloat(depositAmount) }),
        ...(totalCopies && { totalCopies: parseInt(totalCopies) }),
        ...(availableCopies !== undefined && { availableCopies: parseInt(availableCopies) }),
        ...(isbn !== undefined && { isbn }),
        ...(publisher !== undefined && { publisher }),
        ...(yearPublished && { yearPublished: parseInt(yearPublished) }),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.status(200).json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("Update book error:", error);
    return res.status(500).json({ error: "Unable to update book" });
  }
}

/**
 * DELETE /api/admin/books/:id
 * Delete book
 */
async function deleteBook(req, res) {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.status(200).json({
      message: "Book deleted successfully",
      book,
    });
  } catch (error) {
    console.error("Delete book error:", error);
    return res.status(500).json({ error: "Unable to delete book" });
  }
}

module.exports = {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
};
