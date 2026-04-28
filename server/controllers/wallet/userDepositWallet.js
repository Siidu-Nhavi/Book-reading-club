const { creditWallet } = require("../../services/walletService.js");

async function userDepositWallet(req, res) {
  const numericAmount = Number(req.body.amount);
  const note = String(req.body.note || "User wallet deposit").trim();

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: "amount must be a positive number" });
  }

  try {
    const result = await creditWallet({
      userId: req.user._id,
      amount: numericAmount,
      reason: "top_up",
      note,
    });

    return res.status(200).json({
      message: "Wallet funded successfully",
      wallet: {
        creditedAmount: result.appliedAmount,
        balance: result.balance,
      },
    });
  } catch (error) {
    console.error("User deposit wallet error:", error);
    return res.status(500).json({ error: "Unable to deposit to wallet" });
  }
}

module.exports = { userDepositWallet };
