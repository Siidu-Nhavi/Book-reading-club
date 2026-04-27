import { apiRequest, buildQueryString } from "./client";

export const rentalsApi = {
  previewRental(bookId, rentalType, rentalDuration) {
    const query = buildQueryString({ bookId, rentalType, rentalDuration });
    return apiRequest(`/api/rentals/preview${query}`);
  },
  rentBook(bookId, rentalType, rentalDuration) {
    return apiRequest("/api/rentals/create", {
      method: "POST",
      body: JSON.stringify({ bookId, rentalType, rentalDuration }),
    });
  },
  returnBook(rentalId, payload) {
    return apiRequest(`/api/rentals/${rentalId}/return`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getMyRentals(params = {}) {
    const query = buildQueryString(params);
    return apiRequest(`/api/rentals/my-rentals${query}`);
  },
  getAllRentals(params = {}) {
    const query = buildQueryString(params);
    return apiRequest(`/api/rentals/all${query}`);
  },
};
