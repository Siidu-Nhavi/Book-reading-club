const User = require("../../models/User.js");
const {
  hashPassword,
  generateToken,
  generateSalt,
  setAuthCookie,
} = require("../../utils/security.js");
const { serializeUser } = require("../../utils/user.js");

async function register(req, res) {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      salt,
    });

    await newUser.save();

    const token = generateToken(newUser);

    setAuthCookie(res, token);

    return res.status(201).json({
      message: "User registered successfully",
      user: serializeUser(newUser),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { register };
