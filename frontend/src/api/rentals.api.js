import { apiRequest, buildQueryString } from "./client";

export const rentalsApi = {
  rentBook(bookId, durationDays) {
    return apiRequest("/api/rentals/rent", {
      method: "POST",
      body: JSON.stringify({ bookId, durationDays }),
    });
  },
  returnBook(rentalId) {
    return apiRequest("/api/rentals/return", {
      method: "POST",
      body: JSON.stringify({ rentalId }),
    });
  },
  getMyRentals(params = {}) {
    const query = buildQueryString(params);
    return apiRequest(`/api/rentals/my${query}`);
  },
  getAllRentals(params = {}) {
    const query = buildQueryString(params);
    return apiRequest(`/api/rentals/all${query}`);
  },
};
