import { apiRequest } from "./client";

export const walletApi = {
  getBalance() {
    return apiRequest("/api/wallet/balance");
  },
  getTransactions() {
    return apiRequest("/api/wallet/transactions");
  },
  deposit(amount, note = "") {
    return apiRequest("/api/wallet/deposit", {
      method: "POST",
      body: JSON.stringify({ amount, note }),
    });
  },
};
