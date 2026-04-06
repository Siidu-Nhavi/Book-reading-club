const { clearAuthCookie } = require("../../utils/security.js");

function logout(req, res) {
  clearAuthCookie(res);

  return res.status(200).json({ message: "Logged out successfully" });
}

module.exports = { logout };
