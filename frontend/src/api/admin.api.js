import { apiRequest, buildQueryString } from "./client";

export const adminApi = {
  getAllUsers(params = {}) {
    const query = buildQueryString(params);
    return apiRequest(`/api/admin/users${query}`);
  },
  getAllRentalsAdmin(params = {}) {
    const query = buildQueryString(params);
    return apiRequest(`/api/rentals/all${query}`);
  },
  processReturn(rentalId, payload) {
    return apiRequest(`/api/rentals/${rentalId}/return`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  runOverdueCheck() {
    return apiRequest("/api/cron/check-overdue", {
      method: "POST",
    });
  },
};
