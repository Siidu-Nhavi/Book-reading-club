const User = require("../../models/User.js");

const httpUrlPattern = /^https?:\/\/\S+$/i;
const indianMobilePattern = /^(91)?\d{10}$/;

function isValidAvatarUrl(value) {
  return !value || httpUrlPattern.test(value);
}

function isValidMobileNumber(value) {
  const digitsOnly = value.replace(/\D/g, "");
  return !value || indianMobilePattern.test(digitsOnly);
}

async function updateProfile(req, res) {
  const phone = typeof req.body.phone === "string" ? req.body.phone.trim() : undefined;
  const city = typeof req.body.city === "string" ? req.body.city.trim() : undefined;
  const bio = typeof req.body.bio === "string" ? req.body.bio.trim() : undefined;
  const avatar = typeof req.body.avatar === "string" ? req.body.avatar.trim() : undefined;
  const address =
    typeof req.body.address === "string" ? req.body.address.trim() : undefined;
  const dateOfBirth =
    typeof req.body.dateOfBirth === "undefined" || req.body.dateOfBirth === null
      ? req.body.dateOfBirth
      : new Date(req.body.dateOfBirth);

  if (
    typeof phone === "undefined" &&
    typeof city === "undefined" &&
    typeof bio === "undefined" &&
    typeof avatar === "undefined" &&
    typeof address === "undefined" &&
    typeof dateOfBirth === "undefined"
  ) {
    return res.status(400).json({ error: "No profile updates were provided" });
  }

  if (typeof bio !== "undefined" && bio.length > 280) {
    return res.status(400).json({ error: "Bio must be 280 characters or fewer" });
  }

  if (typeof avatar !== "undefined" && !isValidAvatarUrl(avatar)) {
    return res.status(400).json({
      error: "Avatar must be a valid http(s) URL",
    });
  }

  if (typeof phone !== "undefined" && !isValidMobileNumber(phone)) {
    return res.status(400).json({
      error: "Phone number must contain a valid 10-digit number",
    });
  }

  if (typeof address !== "undefined" && address && address.length < 10) {
    return res.status(400).json({
      error: "Address must be at least 10 characters long",
    });
  }

  if (typeof city !== "undefined" && city.length > 120) {
    return res.status(400).json({
      error: "City must be 120 characters or fewer",
    });
  }

  if (dateOfBirth !== undefined && dateOfBirth !== null && Number.isNaN(dateOfBirth.getTime())) {
    return res.status(400).json({ error: "Invalid dateOfBirth" });
  }

  try {
    const updates = {};

    if (typeof phone !== "undefined") {
      updates["profile.mobileNumber"] = phone;
    }

    if (typeof city !== "undefined") {
      updates["profile.city"] = city;
    }

    if (typeof bio !== "undefined") {
      updates["profile.bio"] = bio;
    }

    if (typeof avatar !== "undefined") {
      updates["profile.avatarUrl"] = avatar;
    }

    if (typeof address !== "undefined") {
      updates["profile.address"] = address;
    }

    if (typeof dateOfBirth !== "undefined") {
      updates["profile.dateOfBirth"] = dateOfBirth;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password -salt");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated",
      profile: {
        phone: user.profile?.mobileNumber || "",
        address: user.profile?.address || "",
        city: user.profile?.city || "",
        bio: user.profile?.bio || "",
        avatar: user.profile?.avatarUrl || "",
        dateOfBirth: user.profile?.dateOfBirth || null,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ error: "Unable to update profile" });
  }
}

module.exports = { updateProfile };
