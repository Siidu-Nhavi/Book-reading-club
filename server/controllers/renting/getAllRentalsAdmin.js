const Rental = require("../../models/Rental.js");

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

async function getAllRentalsAdmin(req, res) {
  const page = toPositiveInteger(req.query.page, 1);
  const requestedLimit = toPositiveInteger(req.query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const status = req.query.status?.trim();

  const filters = {};

  if (status) {
    filters.status = status;
  }

  try {
    const [rentals, total] = await Promise.all([
      Rental.find(filters)
        .populate("user", "name email")
        .populate("book", "title author image replacementCost")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Rental.countDocuments(filters),
    ]);

    return res.status(200).json({ total, rentals });
  } catch (error) {
    console.error("Get all rentals admin error:", error);
    return res.status(500).json({ error: "Unable to fetch rentals" });
  }
}

module.exports = { getAllRentalsAdmin };
