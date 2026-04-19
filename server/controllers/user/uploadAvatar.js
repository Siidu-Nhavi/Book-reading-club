const User = require("../../models/User.js");

async function uploadAvatar(req, res) {
  if (!req.file?.filename) {
    return res.status(400).json({ error: "Please upload an image file" });
  }

  try {
    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { "profile.avatarUrl": avatarUrl } },
      {
        new: true,
        runValidators: true,
      },
    ).select("profile.avatarUrl");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Avatar uploaded",
      avatar: user.profile?.avatarUrl || avatarUrl,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return res.status(500).json({ error: "Unable to upload avatar" });
  }
}

module.exports = { uploadAvatar };