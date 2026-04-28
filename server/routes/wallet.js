const express = require("express");
const { getWalletBalance } = require("../controllers/wallet/getWalletBalance.js");
const { getWalletTransactions } = require("../controllers/wallet/getWalletTransactions.js");
const { topUpWallet } = require("../controllers/wallet/topUpWallet.js");
const { userDepositWallet } = require("../controllers/wallet/userDepositWallet.js");
const { requireAdmin, requireAuth } = require("../middleware/auth.js");

const router = express.Router();

router.get("/balance", requireAuth, getWalletBalance);
router.get("/transactions", requireAuth, getWalletTransactions);
router.post("/deposit", requireAuth, userDepositWallet);
router.post("/topup", requireAuth, requireAdmin, topUpWallet);

module.exports = router;
