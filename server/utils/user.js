function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.profile?.avatarUrl || "",
    bio: user.profile?.bio || "",
    mobileNumber: user.profile?.mobileNumber || "",
    address: user.profile?.address || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = { serializeUser };
