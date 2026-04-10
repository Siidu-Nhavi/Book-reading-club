import { apiRequest, buildQueryString } from "./client";

export const reviewsApi = {
  submitReview(payload) {
    return apiRequest("/api/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getBookReviews(bookId, params = {}) {
    const query = buildQueryString(params);
    return apiRequest(`/api/reviews/book/${bookId}${query}`);
  },
  deleteReview(reviewId) {
    return apiRequest(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },
};
