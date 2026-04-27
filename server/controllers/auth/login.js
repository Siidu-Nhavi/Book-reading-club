const bcrypt = require("bcryptjs");
const User = require("../../models/User.js");
const Wallet = require("../../models/Wallet.js");
const { generateToken, setAuthCookie } = require("../../utils/security.js");

async function login(req, res) {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    const wallet = await Wallet.findOne({ user: user._id }).select("balance");

    setAuthCookie(res, token);

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuspended: user.isSuspended,
        isFlagged: user.isFlagged,
        pendingDuesTotal: user.pendingDuesTotal,
        walletBalance: wallet?.balance || 0,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { login };
