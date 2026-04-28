const Book = require("../../models/Book.js");

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 12;

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item).split(","))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function getSort(sortBy) {
  switch (sortBy) {
    case "rentPrice":
    case "pricePerDay":
      return "pricePerDay";
    case "pricePerWeek":
      return "pricePerWeek";
    case "pricePerMonth":
      return "pricePerMonth";
    case "averageRating":
      return "averageRating";
    case "title":
      return "title";
    default:
      return "createdAt";
  }
}

async function getAllBook(req, res) {
  const page = toPositiveInteger(req.query.page, 1);
  const requestedLimit = toPositiveInteger(req.query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const categories = toArray(req.query.category);
  const search = req.query.search?.trim();
  const sortBy = req.query.sortBy?.trim();
  const order = req.query.order?.trim().toLowerCase() === "asc" ? 1 : -1;
  const available = req.query.available;

  const filters = {};

  if (categories.length > 0) {
    filters.category = {
      $in: categories.map((category) => new RegExp(`^${escapeRegex(category)}$`, "i")),
    };
  }

  if (available === "true") {
    filters.isAvailable = true;
  } else if (available === "false") {
    filters.isAvailable = false;
  }

  if (search) {
    const safeSearch = escapeRegex(search);

    filters.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { author: { $regex: safeSearch, $options: "i" } },
    ];
  }

  try {
    const sortField = getSort(sortBy);
    const sort = { [sortField]: order };

    if (sortField !== "createdAt") {
      sort.createdAt = -1;
    }

    const [books, totalBooks] = await Promise.all([
      Book.find(filters)
        .sort(sort)
        .select(
          "_id title author category rentPrice pricePerDay pricePerWeek pricePerMonth depositAmount replacementCost isAvailable unavailabilityReason averageRating image",
        )
        .skip((page - 1) * limit)
        .limit(limit),
      Book.countDocuments(filters),
    ]);

    return res.status(200).json({
      total: totalBooks,
      page,
      limit,
      books,
    });
  } catch (error) {
    console.error("Get all books error:", error);
    return res.status(500).json({ error: "Unable to fetch books" });
  }
}

module.exports = { getAllBook };
