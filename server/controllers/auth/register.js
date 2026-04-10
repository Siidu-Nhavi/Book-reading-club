const User = require("../../models/User.js");
const {
  hashPassword,
  generateToken,
  generateSalt,
  setAuthCookie,
} = require("../../utils/security.js");

async function register(req, res) {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
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
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { register };
