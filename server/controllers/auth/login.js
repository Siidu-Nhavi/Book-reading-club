const bcrypt = require("bcryptjs");
const User = require("../../models/User.js");
const { generateToken, setAuthCookie } = require("../../utils/security.js");
const { serializeUser } = require("../../utils/user.js");

async function login(req, res) {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Logged in successfully",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { login };
