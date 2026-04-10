const User = require("../models/User.js");
const { AUTH_COOKIE_NAME, verifyToken } = require("../utils/security.js");

async function requireAuth(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const payload = verifyToken(token);

  if (!payload?.id) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  try {
    const user = await User.findById(payload.id).select("-password -salt");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Unable to verify session" });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "You are not allowed to access this resource" });
    }

    return next();
  };
}

function requireNotSuspended(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.isSuspended) {
    return res.status(403).json({ error: "Your account is suspended" });
  }

  return next();
}

const requireAdmin = requireRole("admin");

module.exports = {
  requireAuth,
  requireRole,
  requireAdmin,
  requireNotSuspended,
};
