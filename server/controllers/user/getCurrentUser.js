const { serializeUser } = require("../../utils/user.js");

function getCurrentUser(req, res) {
  return res.status(200).json({ user: serializeUser(req.user) });
}

module.exports = { getCurrentUser };
