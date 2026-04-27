const User = require("../../models/User.js");
const Wallet = require("../../models/Wallet.js");

async function searchUsers(req, res) {
  const query = String(req.query.search || "").trim();
  const filters = {};

  if (query) {
    filters.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }

  try {
    const users = await User.find(filters)
      .select("name email role isFlagged pendingDuesTotal isSuspended walletBalanceCache")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const wallets = await Wallet.find({ user: { $in: users.map((user) => user._id) } })
      .select("user balance")
      .lean();
    const walletMap = new Map(wallets.map((wallet) => [String(wallet.user), wallet.balance]));

    return res.status(200).json({
      users: users.map((user) => ({
        ...user,
        walletBalance: walletMap.get(String(user._id)) ?? user.walletBalanceCache ?? 0,
      })),
    });
  } catch (error) {
    console.error("Search users error:", error);
    return res.status(500).json({ error: "Unable to search users" });
  }
}

module.exports = { searchUsers };
