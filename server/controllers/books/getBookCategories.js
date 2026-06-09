const Book = require("../../models/Book.js");

async function getBookCategories(_req, res) {
  try {
    const categories = await Book.distinct("category", { listingStatus: { $ne: "removed" } });

    const normalizedCategories = categories
      .filter(Boolean)
      .map((category) => category.trim())
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right));

    return res.status(200).json({ categories: normalizedCategories });
  } catch (error) {
    console.error("Get book categories error:", error);
    return res.status(500).json({ message: "Unable to fetch book categories" });
  }
}

module.exports = { getBookCategories };
