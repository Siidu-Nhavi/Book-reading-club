import { apiRequest } from "./client";

export const paymentsApi = {
  getPaymentMethods() {
    return apiRequest("/api/payments/methods");
  },
  createSetupIntent() {
    return apiRequest("/api/payments/setup-intent", {
      method: "POST",
    });
  },
  setDefaultPaymentMethod(paymentMethodId) {
    return apiRequest("/api/payments/default", {
      method: "PUT",
      body: JSON.stringify({ paymentMethodId }),
    });
  },
  removePaymentMethod(paymentMethodId) {
    return apiRequest(`/api/payments/methods/${paymentMethodId}`, {
      method: "DELETE",
    });
  },
};
