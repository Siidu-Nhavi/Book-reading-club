function getCurrentUser(req, res) {
  return res.status(200).json({
    _id: req.user._id,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
    phone: req.user.profile?.mobileNumber || "",
    address: req.user.profile?.address || "",
    city: req.user.profile?.city || "",
    bio: req.user.profile?.bio || "",
    avatar: req.user.profile?.avatarUrl || "",
    dateOfBirth: req.user.profile?.dateOfBirth || null,
  });
}

module.exports = { getCurrentUser };
