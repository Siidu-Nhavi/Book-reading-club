import { apiRequest } from "./client";

function toFrontendProfile(profile) {
  return {
    _id: profile?._id || "",
    user: {
      _id: profile?.user?._id || profile?._id || "",
      name: profile?.user?.name || "",
      email: profile?.user?.email || "",
      role: profile?.user?.role || "user",
      isSuspended: Boolean(profile?.user?.isSuspended),
    },
    phone: profile?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    bio: profile?.bio || "",
    avatar: profile?.avatar || "",
    dateOfBirth: profile?.dateOfBirth || null,
  };
}

function toUpdatePayload(payload = {}) {
  return {
    phone: payload.mobileNumber ?? payload.phone,
    address: payload.address,
    city: payload.city,
    bio: payload.bio,
    avatar: payload.avatarUrl ?? payload.avatar,
    dateOfBirth: payload.dateOfBirth,
  };
}

export const profileApi = {
  async getMyProfile() {
    const data = await apiRequest("/api/profile/me");
    return toFrontendProfile(data);
  },
  async updateMyProfile(payload) {
    const data = await apiRequest("/api/profile/me", {
      method: "PUT",
      body: JSON.stringify(toUpdatePayload(payload)),
    });

    return {
      ...data,
      profile: toFrontendProfile(data?.profile || {}),
    };
  },
};
