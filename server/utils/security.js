const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const AUTH_COOKIE_NAME = "token";

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
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

const getAuthCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
  };
};

const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
};

const clearAuthCookie = (res) => {
  const cookieOptions = getAuthCookieOptions();

  delete cookieOptions.maxAge;

  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions);
};

const parseCookies = (cookieHeader = "") => {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce((cookies, cookiePart) => {
    const [rawName, ...rawValueParts] = cookiePart.trim().split("=");

    if (!rawName) {
      return cookies;
    }

    cookies[rawName] = decodeURIComponent(rawValueParts.join("="));
    return cookies;
  }, {});
};

module.exports = {
  AUTH_COOKIE_NAME,
  clearAuthCookie,
  generateToken,
  verifyToken,
  hashPassword,
  generateSalt,
  getAuthCookieOptions,
  parseCookies,
  setAuthCookie,
};
