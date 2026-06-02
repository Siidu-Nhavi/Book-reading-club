const User = require("../../models/User.js");

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
      .select("name email role isSuspended")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Search users error:", error);
    return res.status(500).json({ error: "Unable to search users" });
  }
}

module.exports = { searchUsers };
