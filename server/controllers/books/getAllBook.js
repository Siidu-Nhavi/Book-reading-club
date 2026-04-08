const Book = require("../../models/Book.js");

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 12;

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function getSort(sortBy) {
  switch (sortBy) {
    case "price_asc":
      return { price: 1, createdAt: -1 };
    case "price_desc":
      return { price: -1, createdAt: -1 };
    case "title_asc":
      return { title: 1 };
    case "title_desc":
      return { title: -1 };
    case "latest":
    default:
      return { createdAt: -1 };
  }
}

async function getAllBook(req, res) {
  const page = toPositiveInteger(req.query.page, 1);
  const requestedLimit = toPositiveInteger(req.query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const category = req.query.category?.trim();
  const search = req.query.search?.trim();
  const sortBy = req.query.sortBy?.trim();

  const filters = {};

  if (category) {
    filters.category = category;
  }

  if (search) {
    filters.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const [books, totalBooks] = await Promise.all([
      Book.find(filters)
        .sort(getSort(sortBy))
        .skip((page - 1) * limit)
        .limit(limit),
      Book.countDocuments(filters),
    ]);

    return res.status(200).json({
      books,
      pagination: {
        page,
        limit,
        totalBooks,
        totalPages: Math.ceil(totalBooks / limit) || 1,
        hasNextPage: page * limit < totalBooks,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all books error:", error);
    return res.status(500).json({ message: "Unable to fetch books" });
  }
}

module.exports = { getAllBook };
