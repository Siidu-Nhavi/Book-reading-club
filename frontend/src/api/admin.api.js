import { apiRequest, buildQueryString } from "./client";

export const adminApi = {
  addBook(payload) {
    return apiRequest("/api/books", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateBook(id, payload) {
    return apiRequest(`/api/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteBook(id) {
    return apiRequest(`/api/books/${id}`, {
      method: "DELETE",
    });
  },
  getAllUsers(params = {}) {
    const query = buildQueryString(params);
    return apiRequest(`/api/admin/users${query}`);
  },
  suspendUser(id, isSuspended) {
    return apiRequest(`/api/admin/users/${id}/suspend`, {
      method: "PATCH",
      body: JSON.stringify({ isSuspended }),
    });
  },
  setMaxRentals(id, maxRentalsAllowed) {
    return apiRequest(`/api/admin/users/${id}/max-rentals`, {
      method: "PATCH",
      body: JSON.stringify({ maxRentalsAllowed }),
    });
  },
  getAllRentalsAdmin(params = {}) {
    const query = buildQueryString(params);
    return apiRequest(`/api/rentals/all${query}`);
  },
};
