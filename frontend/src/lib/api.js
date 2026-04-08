const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export const authApi = {
  signup(payload) {
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
  me() {
    return apiRequest("/api/user/me");
  },
};

export const userApi = {
  updateProfile(payload) {
    return apiRequest("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};
