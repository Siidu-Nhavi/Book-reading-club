import {
  authApi as authApiV2,
  booksApi as booksApiV2,
  profileApi,
} from "../api";

function mapSessionProfileToUser(profile = {}) {
  return {
    _id: profile?.user?._id || profile?._id || "",
    name: profile?.user?.name || "",
    email: profile?.user?.email || "",
    role: profile?.user?.role || "user",
    isSuspended: Boolean(profile?.user?.isSuspended),
    bio: profile?.bio || "",
    mobileNumber: profile?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    avatarUrl: profile?.avatar || "",
    dateOfBirth: profile?.dateOfBirth || null,
  };
}

function mapProfilePatchToUser(profile = {}) {
  return {
    bio: profile?.bio || "",
    mobileNumber: profile?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    avatarUrl: profile?.avatar || "",
    dateOfBirth: profile?.dateOfBirth || null,
  };
}

export const authApi = {
  signup(payload) {
    return authApiV2.register(payload);
  },
  login(payload) {
    return authApiV2.login(payload);
  },
  logout() {
    return authApiV2.logout();
  },
  async me() {
    const profile = await profileApi.getMyProfile();
    return { user: mapSessionProfileToUser(profile) };
  },
};

export const userApi = {
  async updateProfile(payload) {
    const data = await profileApi.updateMyProfile(payload);

    return {
      message: data?.message || "Profile updated",
      user: mapProfilePatchToUser(data?.profile || {}),
    };
  },
};

export const booksApi = {
  list(params = {}) {
    return booksApiV2.getBooks(params);
  },
  categories() {
    return booksApiV2.getBookCategories();
  },
  getById(id) {
    return booksApiV2.getBookById(id);
  },
};
