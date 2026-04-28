const { getWalletOverview } = require("../../services/walletService.js");

async function getWalletBalance(req, res) {
  try {
    const overview = await getWalletOverview(req.user._id);

    return res.status(200).json({
      balance: overview.wallet.balance,
      pendingDuesTotal: overview.pendingDuesTotal,
      pendingDues: overview.pendingDues,
      heldRefundTotal: overview.heldRefundTotal,
    });
  } catch (error) {
    console.error("Get wallet balance error:", error);
    return res.status(500).json({ error: "Unable to fetch wallet balance" });
  }
}

module.exports = { getWalletBalance };
