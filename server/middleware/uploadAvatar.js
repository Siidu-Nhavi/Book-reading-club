const fs = require("fs");
const path = require("path");
const multer = require("multer");

const avatarDirectory = path.resolve(__dirname, "..", "uploads", "avatars");
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(avatarDirectory, { recursive: true });
    cb(null, avatarDirectory);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    const safeUserId = String(req.user?._id || "guest").replace(/[^a-zA-Z0-9_-]/g, "");
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeUserId}-${uniqueSuffix}${extension}`);
  },
});

const uploadAvatar = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new Error("Only JPG, PNG, WEBP, and GIF image files are allowed"));
      return;
    }

    cb(null, true);
  },
});

module.exports = { uploadAvatar };