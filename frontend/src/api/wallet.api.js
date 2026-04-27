import { apiRequest } from "./client";

export const walletApi = {
  getBalance() {
    return apiRequest("/api/wallet/balance");
  },
  getTransactions() {
    return apiRequest("/api/wallet/transactions");
  },
};
