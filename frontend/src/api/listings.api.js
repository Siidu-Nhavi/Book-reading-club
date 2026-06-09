import { apiRequest } from "./client";

export const listingsApi = {
  getMyListings() {
    return apiRequest("/api/listings/my");
  },
  createListing(payload) {
    return apiRequest("/api/listings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateListing(id, payload) {
    return apiRequest(`/api/listings/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteListing(id) {
    return apiRequest(`/api/listings/${id}`, {
      method: "DELETE",
    });
  },
};
