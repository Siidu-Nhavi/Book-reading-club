const mongoose = require("mongoose");
const { creditWallet } = require("../../services/walletService.js");
const User = require("../../models/User.js");

async function topUpWallet(req, res) {
  const { userId, amount, note = "" } = req.body;
  const numericAmount = Number(amount);

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "A valid userId is required" });
  }

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: "amount must be a positive number" });
  }

  try {
    const user = await User.findById(userId).select("name email");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await creditWallet({
      userId,
      amount: numericAmount,
      reason: "top_up",
      note,
    });

    return res.status(200).json({
      message: "Wallet topped up successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      wallet: {
        creditedAmount: result.appliedAmount,
        balance: result.balance,
        settlement: result.settlement,
      },
    });
  } catch (error) {
    console.error("Top up wallet error:", error);
    return res.status(500).json({ error: "Unable to top up wallet" });
  }
}

module.exports = { topUpWallet };
