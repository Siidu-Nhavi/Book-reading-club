import { apiRequest } from "./client";

export const authApi = {
  register(payload) {
    return apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  login(payload) {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  logout() {
    return apiRequest("/api/auth/logout", {
      method: "POST",
    });
  },
};
