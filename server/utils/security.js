const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const hashPassword = async (password, salt) => {
  return bcrypt.hash(password, salt);
};

const generateSalt = async () => {
  return bcrypt.genSalt(10);
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  generateSalt,
};
