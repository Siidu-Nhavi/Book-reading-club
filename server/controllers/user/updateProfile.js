const User = require("../../models/User.js");
const { serializeUser } = require("../../utils/user.js");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dataImagePattern = /^data:image\/[a-zA-Z0-9.+-]+;base64,/i;
const httpUrlPattern = /^https?:\/\/\S+$/i;
const indianMobilePattern = /^(91)?\d{10}$/;

function isValidAvatarUrl(value) {
  return !value || dataImagePattern.test(value) || httpUrlPattern.test(value);
}

function isValidMobileNumber(value) {
  const digitsOnly = value.replace(/\D/g, "");
  return !value || indianMobilePattern.test(digitsOnly);
}

async function updateProfile(req, res) {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : undefined;
  const email =
    typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : undefined;
  const bio = typeof req.body.bio === "string" ? req.body.bio.trim() : undefined;
  const avatarUrl =
    typeof req.body.avatarUrl === "string" ? req.body.avatarUrl.trim() : undefined;
  const mobileNumber =
    typeof req.body.mobileNumber === "string" ? req.body.mobileNumber.trim() : undefined;
  const address =
    typeof req.body.address === "string" ? req.body.address.trim() : undefined;

  if (
    typeof name === "undefined" &&
    typeof email === "undefined" &&
    typeof bio === "undefined" &&
    typeof avatarUrl === "undefined" &&
    typeof mobileNumber === "undefined" &&
    typeof address === "undefined"
  ) {
    return res.status(400).json({ message: "No profile updates were provided" });
  }

  if (typeof name !== "undefined" && name.length < 3) {
    return res.status(400).json({ message: "Name must be at least 3 characters long" });
  }

  if (typeof email !== "undefined" && !emailPattern.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address" });
  }

  if (typeof bio !== "undefined" && bio.length > 280) {
    return res.status(400).json({ message: "Bio must be 280 characters or fewer" });
  }

  if (typeof avatarUrl !== "undefined" && !isValidAvatarUrl(avatarUrl)) {
    return res.status(400).json({
      message: "Avatar must be a valid http(s) URL or an uploaded image data URL",
    });
  }

  if (typeof mobileNumber !== "undefined" && !isValidMobileNumber(mobileNumber)) {
    return res.status(400).json({
      message: "Mobile number must contain a valid 10-digit number",
    });
  }

  if (typeof address !== "undefined" && address && address.length < 10) {
    return res.status(400).json({
      message: "Address must be at least 10 characters long",
    });
  }

  try {
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updates = {};

    if (typeof name !== "undefined") {
      updates.name = name;
    }

    if (typeof email !== "undefined") {
      updates.email = email;
    }

    if (typeof bio !== "undefined") {
      updates["profile.bio"] = bio;
    }

    if (typeof avatarUrl !== "undefined") {
      updates["profile.avatarUrl"] = avatarUrl;
    }

    if (typeof mobileNumber !== "undefined") {
      updates["profile.mobileNumber"] = mobileNumber;
    }

    if (typeof address !== "undefined") {
      updates["profile.address"] = address;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password -salt");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Unable to update profile" });
  }
}

module.exports = { updateProfile };
