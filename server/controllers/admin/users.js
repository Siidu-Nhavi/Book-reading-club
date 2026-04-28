const User = require("../../models/User.js");
const Wallet = require("../../models/Wallet.js");

/**
 * GET /api/admin/users
 * Get all users with optional search and pagination
 */
async function getAllUsers(req, res) {
  try {
    const { search = "", page = 1, limit = 10, role = "", status = "" } = req.query;
    const skip = (page - 1) * limit;

    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    if (role && role !== "all") {
      searchFilter.role = role;
    }

    if (status === "suspended") {
      searchFilter.isSuspended = true;
    } else if (status === "active") {
      searchFilter.isSuspended = false;
    }

    const users = await User.find(searchFilter)
      .select("-password -salt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get wallet info for each user
    const usersWithWallet = await Promise.all(
      users.map(async (user) => {
        const wallet = await Wallet.findOne({ user: user._id }).select("balance");
        return {
          ...user,
          walletBalance: wallet?.balance || 0,
        };
      })
    );

    const total = await User.countDocuments(searchFilter);

    return res.status(200).json({
      users: usersWithWallet,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ error: "Unable to fetch users" });
  }
}

/**
 * PUT /api/admin/users/:id/suspend
 * Suspend/unsuspend user
 */
async function toggleUserSuspension(req, res) {
  try {
    const { id } = req.params;
    const { isSuspended } = req.body;

    if (typeof isSuspended !== "boolean") {
      return res.status(400).json({ error: "isSuspended must be a boolean" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isSuspended, updatedAt: new Date() },
      { new: true }
    ).select("-password -salt");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: `User ${isSuspended ? "suspended" : "unsuspended"} successfully`,
      user,
    });
  } catch (error) {
    console.error("Toggle suspension error:", error);
    return res.status(500).json({ error: "Unable to update user status" });
  }
}

/**
 * PUT /api/admin/users/:id/role
 * Assign role to user (admin or user)
 */
async function assignRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ error: "Role must be 'admin' or 'user'" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role, updatedAt: new Date() },
      { new: true }
    ).select("-password -salt");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    console.error("Assign role error:", error);
    return res.status(500).json({ error: "Unable to assign role" });
  }
}

/**
 * PUT /api/admin/users/:id/wallet
 * Top-up user wallet
 */
async function topUpWallet(req, res) {
  try {
    const { id } = req.params;
    const { amount, note } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let wallet = await Wallet.findOne({ user: id });
    if (!wallet) {
      wallet = new Wallet({ user: id, balance: 0 });
    }

    wallet.balance += parseFloat(amount);
    await wallet.save();

    return res.status(200).json({
      message: "Wallet topped up successfully",
      wallet,
    });
  } catch (error) {
    console.error("Top-up wallet error:", error);
    return res.status(500).json({ error: "Unable to top-up wallet" });
  }
}

module.exports = {
  getAllUsers,
  toggleUserSuspension,
  assignRole,
  topUpWallet,
};
