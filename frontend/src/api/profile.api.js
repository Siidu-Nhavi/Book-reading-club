import { apiRequest } from "./client";

function normalizeAvatarUrl(value = "") {
  const avatar = String(value || "").trim();

  if (!avatar) {
    return "";
  }

  if (/^(https?:|blob:|data:)/i.test(avatar)) {
    return avatar;
  }

  const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

  if (avatar.startsWith("/")) {
    return base ? `${base}${avatar}` : avatar;
  }

  return avatar;
}

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
    avatar: normalizeAvatarUrl(profile?.avatar || ""),
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

const DEFAULT_ACCOUNT_SETTINGS = {
  emailOrderUpdates: true,
  emailRecommendations: true,
  pushFlashDeals: false,
  smsDeliveryAlerts: true,
  oneClickCheckout: false,
  saveCardsForFasterCheckout: true,
  defaultDeliveryType: "home",
  twoFactorAuth: false,
  allowNewDeviceLogin: true,
  marketingPersonalization: true,
};

function normalizeAccountSettings(settings = {}) {
  return {
    ...DEFAULT_ACCOUNT_SETTINGS,
    ...(settings || {}),
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
  async uploadAvatar(file) {
    const body = new FormData();
    body.append("avatar", file);

    const data = await apiRequest("/api/profile/avatar", {
      method: "POST",
      body,
    });

    return {
      ...data,
      avatar: normalizeAvatarUrl(data?.avatar || ""),
    };
  },
  async getAccountSettings() {
    const data = await apiRequest("/api/profile/settings");
    return normalizeAccountSettings(data?.settings);
  },
  async updateAccountSettings(settings) {
    const data = await apiRequest("/api/profile/settings", {
      method: "PUT",
      body: JSON.stringify({ settings }),
    });

    return {
      ...data,
      settings: normalizeAccountSettings(data?.settings),
    };
  },
};
