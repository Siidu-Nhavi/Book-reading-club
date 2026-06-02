const User = require("../../models/User.js");

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

    const total = await User.countDocuments(searchFilter);

    return res.status(200).json({
      users,
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

module.exports = {
  getAllUsers,
  toggleUserSuspension,
  assignRole,
};
