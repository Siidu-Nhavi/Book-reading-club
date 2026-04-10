const mongoose = require("mongoose");
const Book = require("../../models/Book.js");
const Rental = require("../../models/Rental.js");
const User = require("../../models/User.js");

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DEFAULT_RENTAL_DAYS = 7;
const MAX_RENTAL_DAYS = 30;

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

async function rentBook(req, res) {
  const { bookId } = req.body;

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: "A valid bookId is required" });
  }

  const requestedDays = toPositiveInteger(req.body.durationDays, DEFAULT_RENTAL_DAYS);

  if (requestedDays > MAX_RENTAL_DAYS) {
    return res.status(400).json({
      error: `durationDays cannot be more than ${MAX_RENTAL_DAYS}`,
    });
  }

  const startDate = new Date();
  const dueDate = new Date(Date.now() + requestedDays * DAY_IN_MS);

  let didLockBook = false;
  let didIncrementUserRentals = false;

  try {
    const book = await Book.findOneAndUpdate(
      { _id: bookId, isAvailable: true },
      { $set: { isAvailable: false } },
      { new: true },
    );

    if (!book) {
      const bookExists = await Book.exists({ _id: bookId });

      return res.status(bookExists ? 400 : 404).json({
        error: bookExists ? "Book is currently unavailable" : "Book not found",
      });
    }

    didLockBook = true;

    const user = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        isSuspended: false,
        $expr: { $lt: ["$activeRentalsCount", "$maxRentalsAllowed"] },
      },
      { $inc: { activeRentalsCount: 1 } },
      { new: true },
    );

    if (!user) {
      await Book.updateOne({ _id: book._id }, { $set: { isAvailable: true } });

      return res.status(400).json({ error: "Rental limit reached or account is suspended" });
    }

    didIncrementUserRentals = true;

    const rental = await Rental.create({
      user: user._id,
      book: book._id,
      startDate,
      dueDate,
      status: "active",
    });

    return res.status(201).json({
      message: "Book rented successfully",
      rental: {
        _id: rental._id,
        book: rental.book,
        startDate: rental.startDate,
        dueDate: rental.dueDate,
        status: rental.status,
      },
    });
  } catch (error) {
    if (didLockBook && !didIncrementUserRentals) {
      await Book.updateOne({ _id: bookId }, { $set: { isAvailable: true } });
    }

    if (didIncrementUserRentals) {
      await User.updateOne(
        { _id: req.user._id, activeRentalsCount: { $gt: 0 } },
        { $inc: { activeRentalsCount: -1 } },
      );

      await Book.updateOne({ _id: bookId }, { $set: { isAvailable: true } });
    }

    console.error("Rent book error:", error);
    return res.status(500).json({ error: "Unable to rent book" });
  }
}

module.exports = { rentBook };
