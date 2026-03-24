import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const hashPassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
}

const generateSalt = async () => {
  return await bcrypt.genSalt(10);
}