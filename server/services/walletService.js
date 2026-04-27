const Wallet = require("../models/Wallet.js");
const WalletTransaction = require("../models/WalletTransaction.js");
const PendingDue = require("../models/PendingDue.js");
const User = require("../models/User.js");
const { roundCurrency } = require("../utils/rentalPricing.js");

async function ensureWallet(userId) {
  let wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    wallet = await Wallet.create({
      user: userId,
      balance: 0,
      lastUpdated: new Date(),
    });
  }

  return wallet;
}

async function syncUserFinancialFlags(userId) {
  const [wallet, pendingResult] = await Promise.all([
    ensureWallet(userId),
    PendingDue.aggregate([
      {
        $match: {
          user: userId,
          status: "pending",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  const pendingDuesTotal = roundCurrency(pendingResult[0]?.total || 0);
  const isFlagged = pendingDuesTotal > 0;

  await User.updateOne(
    { _id: userId },
    {
      $set: {
        walletBalanceCache: wallet.balance,
        pendingDuesTotal,
        isFlagged,
      },
    },
  );

  return {
    wallet,
    pendingDuesTotal,
    isFlagged,
  };
}

async function recordTransaction({
  userId,
  type,
  amount,
  reason,
  referenceId = null,
  note = "",
}) {
  if (!amount || amount <= 0) {
    return null;
  }

  return WalletTransaction.create({
    user: userId,
    type,
    amount: roundCurrency(amount),
    reason,
    referenceId,
    note,
  });
}

async function creditWallet({ userId, amount, reason, referenceId = null, note = "" }) {
  const normalizedAmount = roundCurrency(amount);

  if (normalizedAmount <= 0) {
    return { appliedAmount: 0, balance: (await ensureWallet(userId)).balance };
  }

  const wallet = await ensureWallet(userId);
  wallet.balance = roundCurrency(wallet.balance + normalizedAmount);
  wallet.lastUpdated = new Date();
  await wallet.save();

  await recordTransaction({
    userId,
    type: "credit",
    amount: normalizedAmount,
    reason,
    referenceId,
    note,
  });

  await syncUserFinancialFlags(userId);

  return {
    appliedAmount: normalizedAmount,
    balance: wallet.balance,
  };
}

async function debitWallet({
  userId,
  amount,
  reason,
  referenceId = null,
  note = "",
  allowPartial = false,
}) {
  const normalizedAmount = roundCurrency(amount);
  const wallet = await ensureWallet(userId);

  if (normalizedAmount <= 0) {
    return {
      requestedAmount: 0,
      appliedAmount: 0,
      remainingAmount: 0,
      balance: wallet.balance,
    };
  }

  const availableAmount = roundCurrency(wallet.balance);

  if (!allowPartial && availableAmount < normalizedAmount) {
    return {
      requestedAmount: normalizedAmount,
      appliedAmount: 0,
      remainingAmount: normalizedAmount,
      balance: wallet.balance,
    };
  }

  const appliedAmount = allowPartial
    ? Math.min(availableAmount, normalizedAmount)
    : normalizedAmount;
  const remainingAmount = roundCurrency(normalizedAmount - appliedAmount);

  wallet.balance = roundCurrency(wallet.balance - appliedAmount);
  wallet.lastUpdated = new Date();
  await wallet.save();

  await recordTransaction({
    userId,
    type: "debit",
    amount: appliedAmount,
    reason,
    referenceId,
    note,
  });

  await syncUserFinancialFlags(userId);

  return {
    requestedAmount: normalizedAmount,
    appliedAmount,
    remainingAmount,
    balance: wallet.balance,
  };
}

async function createPendingDue({ userId, rentalId = null, amount, reason, note = "" }) {
  const normalizedAmount = roundCurrency(amount);

  if (normalizedAmount <= 0) {
    return null;
  }

  const pendingDue = await PendingDue.create({
    user: userId,
    rental: rentalId,
    amount: normalizedAmount,
    reason,
    note,
  });

  await syncUserFinancialFlags(userId);
  return pendingDue;
}

async function getWalletOverview(userId) {
  const [wallet, pendingDues] = await Promise.all([
    ensureWallet(userId),
    PendingDue.find({ user: userId, status: "pending" }).sort({ createdAt: -1 }),
  ]);

  const pendingDuesTotal = roundCurrency(
    pendingDues.reduce((total, due) => total + Number(due.amount || 0), 0),
  );

  return {
    wallet,
    pendingDues,
    pendingDuesTotal,
  };
}

module.exports = {
  ensureWallet,
  syncUserFinancialFlags,
  recordTransaction,
  creditWallet,
  debitWallet,
  createPendingDue,
  getWalletOverview,
};
