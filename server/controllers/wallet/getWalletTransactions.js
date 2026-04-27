const WalletTransaction = require("../../models/WalletTransaction.js");

async function getWalletTransactions(req, res) {
  try {
    const transactions = await WalletTransaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(200);

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error("Get wallet transactions error:", error);
    return res.status(500).json({ error: "Unable to fetch wallet transactions" });
  }
}

module.exports = { getWalletTransactions };
