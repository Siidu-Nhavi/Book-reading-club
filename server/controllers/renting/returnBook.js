const mongoose = require("mongoose");
const Book = require("../../models/Book.js");
const Rental = require("../../models/Rental.js");
const User = require("../../models/User.js");

const DAY_IN_MS = 24 * 60 * 60 * 1000;

async function returnBook(req, res) {
  const { rentalId } = req.body;

  if (!rentalId || !mongoose.Types.ObjectId.isValid(rentalId)) {
    return res.status(400).json({ error: "A valid rentalId is required" });
  }

  try {
    const rental = await Rental.findById(rentalId);

    if (!rental) {
      return res.status(404).json({ error: "Rental not found" });
    }

    const isOwner = String(rental.user) === String(req.user._id);

    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "You cannot return this rental" });
    }

    if (rental.returnedDate || rental.status === "returned") {
      return res.status(400).json({ error: "This rental was already returned" });
    }

    const book = await Book.findById(rental.book).select("penaltyPerDay");

    if (!book) {
      return res.status(404).json({ error: "Associated book not found" });
    }

    const returnedDate = new Date();
    const lateByMs = returnedDate.getTime() - new Date(rental.dueDate).getTime();
    const overdueDays = lateByMs > 0 ? Math.ceil(lateByMs / DAY_IN_MS) : 0;
    const penaltyAmount = overdueDays * (book.penaltyPerDay || 0);

    const updatedRental = await Rental.findByIdAndUpdate(
      rental._id,
      {
        $set: {
          returnedDate,
          overdueDays,
          penaltyAmount,
          penaltyPaid: false,
          status: overdueDays > 0 ? "penalised" : "returned",
        },
      },
      { new: true },
    );

    await Promise.all([
      Book.updateOne({ _id: rental.book }, { $set: { isAvailable: true } }),
      User.updateOne(
        { _id: rental.user, activeRentalsCount: { $gt: 0 } },
        { $inc: { activeRentalsCount: -1 } },
      ),
    ]);

    return res.status(200).json({
      message: "Book returned",
      rental: {
        status: updatedRental.status,
        returnedDate: updatedRental.returnedDate,
        overdueDays: updatedRental.overdueDays,
        penaltyAmount: updatedRental.penaltyAmount,
      },
    });
  } catch (error) {
    console.error("Return book error:", error);
    return res.status(500).json({ error: "Unable to return book" });
  }
}

module.exports = { returnBook };
