const test = require("node:test");
const assert = require("node:assert/strict");

const walletServicePath = "../services/walletService.js";
const walletModelPath = "../models/Wallet.js";
const walletTransactionModelPath = "../models/WalletTransaction.js";
const pendingDueModelPath = "../models/PendingDue.js";
const userModelPath = "../models/User.js";

function freshRequire(modulePath) {
  return require(modulePath);
}

function createWalletState(initialBalance = 0) {
  return {
    balance: initialBalance,
    lastUpdated: null,
    saveCalls: 0,
    async save() {
      this.saveCalls += 1;
      return this;
    },
  };
}

function createPendingDue({ amount, reason = "overdue_charge" }) {
  return {
    _id: `${reason}-${amount}-${Math.random().toString(16).slice(2)}`,
    amount,
    reason,
    status: "pending",
    clearedAt: null,
    note: `due-${amount}`,
    saveCalls: 0,
    async save() {
      this.saveCalls += 1;
      return this;
    },
  };
}

function setupServiceStubs({ balance = 0, dues = [] } = {}) {
  const Wallet = freshRequire(walletModelPath);
  const WalletTransaction = freshRequire(walletTransactionModelPath);
  const PendingDue = freshRequire(pendingDueModelPath);
  const User = freshRequire(userModelPath);
  const walletService = freshRequire(walletServicePath);

  const wallet = createWalletState(balance);
  const transactionRecords = [];
  const userUpdates = [];

  Wallet.findOne = async () => wallet;
  Wallet.create = async (payload) => ({
    ...payload,
    save: async function save() {
      return this;
    },
  });

  WalletTransaction.create = async (payload) => {
    transactionRecords.push(payload);
    return payload;
  };

  PendingDue.find = () => ({
    sort: () => dues,
  });
  PendingDue.aggregate = async () => [
    {
      total: dues.filter((due) => due.status === "pending").reduce((sum, due) => sum + Number(due.amount || 0), 0),
    },
  ];
  PendingDue.create = async (payload) => payload;

  User.updateOne = async (_filter, update) => {
    userUpdates.push(update);
    return update;
  };

  return {
    walletService,
    wallet,
    dues,
    transactionRecords,
    userUpdates,
    restore() {
      delete Wallet.findOne;
      delete Wallet.create;
      delete WalletTransaction.create;
      delete PendingDue.find;
      delete PendingDue.aggregate;
      delete PendingDue.create;
      delete User.updateOne;
    },
  };
}

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test("creditWallet clears pending dues in FIFO order and clears flag when dues are fully settled", async () => {
  const dueA = createPendingDue({ amount: 100, reason: "overdue_charge" });
  const dueB = createPendingDue({ amount: 150, reason: "damage_charge" });
  const { walletService, wallet, dues, transactionRecords, userUpdates, restore } = setupServiceStubs({
    balance: 0,
    dues: [dueA, dueB],
  });

  try {
    const result = await walletService.creditWallet({
      userId: "507f1f77bcf86cd799439011",
      amount: 300,
      reason: "top_up",
    });

    assert.equal(result.appliedAmount, 300);
    assert.equal(result.balance, 50);
    assert.equal(result.settlement.settledAmount, 250);
    assert.equal(result.settlement.settledCount, 2);
    assert.equal(wallet.balance, 50);
    assert.equal(dueA.status, "cleared");
    assert.equal(dueB.status, "cleared");
    assert.ok(dueA.clearedAt instanceof Date);
    assert.ok(dueB.clearedAt instanceof Date);
    assert.equal(transactionRecords.length, 3);
    assert.equal(transactionRecords[0].reason, "top_up");
    assert.equal(transactionRecords[1].reason, "pending_due_settlement");
    assert.equal(transactionRecords[2].reason, "pending_due_settlement");
    assert.equal(transactionRecords[1].referenceId, dueA._id);
    assert.equal(transactionRecords[2].referenceId, dueB._id);
    assert.ok(userUpdates.length > 0);
    assert.equal(userUpdates.at(-1).$set.pendingDuesTotal, 0);
    assert.equal(userUpdates.at(-1).$set.isFlagged, false);
  } finally {
    restore();
  }
});

test("creditWallet settles only the oldest dues that fully fit in the available credit", async () => {
  const dueA = createPendingDue({ amount: 100, reason: "overdue_charge" });
  const dueB = createPendingDue({ amount: 150, reason: "damage_charge" });
  const dueC = createPendingDue({ amount: 75, reason: "lost_charge" });
  const { walletService, wallet, dues, transactionRecords, userUpdates, restore } = setupServiceStubs({
    balance: 0,
    dues: [dueA, dueB, dueC],
  });

  try {
    const result = await walletService.creditWallet({
      userId: "507f1f77bcf86cd799439012",
      amount: 220,
      reason: "top_up",
    });

    assert.equal(result.appliedAmount, 220);
    assert.equal(result.balance, 120);
    assert.equal(result.settlement.settledAmount, 100);
    assert.equal(result.settlement.settledCount, 1);
    assert.equal(wallet.balance, 120);
    assert.equal(dueA.status, "cleared");
    assert.equal(dueB.status, "pending");
    assert.equal(dueC.status, "pending");
    assert.equal(transactionRecords.length, 2);
    assert.equal(transactionRecords[1].reason, "pending_due_settlement");
    assert.equal(transactionRecords[1].referenceId, dueA._id);
    assert.ok(userUpdates.length > 0);
    assert.equal(userUpdates.at(-1).$set.pendingDuesTotal, 225);
    assert.equal(userUpdates.at(-1).$set.isFlagged, true);
  } finally {
    restore();
  }
});

test("creditWallet with no pending dues leaves the credit intact and keeps the user unflagged", async () => {
  const { walletService, wallet, transactionRecords, userUpdates, restore } = setupServiceStubs({
    balance: 25,
    dues: [],
  });

  try {
    const result = await walletService.creditWallet({
      userId: "507f1f77bcf86cd799439013",
      amount: 75,
      reason: "top_up",
    });

    assert.equal(result.appliedAmount, 75);
    assert.equal(result.balance, 100);
    assert.equal(result.settlement.settledAmount, 0);
    assert.equal(result.settlement.settledCount, 0);
    assert.equal(wallet.balance, 100);
    assert.equal(transactionRecords.length, 1);
    assert.equal(transactionRecords[0].reason, "top_up");
    assert.ok(userUpdates.length > 0);
    assert.equal(userUpdates.at(-1).$set.pendingDuesTotal, 0);
    assert.equal(userUpdates.at(-1).$set.isFlagged, false);
  } finally {
    restore();
  }
});

test("wallet deposit controller returns settlement metadata", async () => {
  const walletService = freshRequire(walletServicePath);
  const previousCreditWallet = walletService.creditWallet;
  const userDepositWalletPath = "../controllers/wallet/userDepositWallet.js";

  walletService.creditWallet = async () => ({
    appliedAmount: 200,
    balance: 150,
    settlement: {
      settledAmount: 50,
      settledCount: 1,
      balance: 150,
    },
  });

  delete require.cache[require.resolve(userDepositWalletPath)];
  const { userDepositWallet } = freshRequire(userDepositWalletPath);
  const req = { body: { amount: 200, note: "wallet deposit" }, user: { _id: "507f1f77bcf86cd799439014" } };
  const res = createResponse();

  try {
    await userDepositWallet(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.wallet.creditedAmount, 200);
    assert.equal(res.body.wallet.balance, 150);
    assert.equal(res.body.wallet.settlement.settledAmount, 50);
    assert.equal(res.body.wallet.settlement.settledCount, 1);
  } finally {
    walletService.creditWallet = previousCreditWallet;
    delete require.cache[require.resolve(userDepositWalletPath)];
  }
});

test("admin top-up controller returns settlement metadata", async () => {
  const walletService = freshRequire(walletServicePath);
  const previousCreditWallet = walletService.creditWallet;
  const previousFindById = freshRequire(userModelPath).findById;
  const topUpWalletPath = "../controllers/wallet/topUpWallet.js";

  walletService.creditWallet = async () => ({
    appliedAmount: 500,
    balance: 300,
    settlement: {
      settledAmount: 200,
      settledCount: 2,
      balance: 300,
    },
  });
  freshRequire(userModelPath).findById = () => ({
    select: async () => ({
      _id: "507f1f77bcf86cd799439015",
      name: "Ava",
      email: "ava@example.com",
    }),
  });

  delete require.cache[require.resolve(topUpWalletPath)];
  const { topUpWallet } = freshRequire(topUpWalletPath);
  const req = {
    body: { userId: "507f1f77bcf86cd799439015", amount: 500, note: "admin top up" },
  };
  const res = createResponse();

  try {
    await topUpWallet(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.user.name, "Ava");
    assert.equal(res.body.wallet.creditedAmount, 500);
    assert.equal(res.body.wallet.balance, 300);
    assert.equal(res.body.wallet.settlement.settledAmount, 200);
    assert.equal(res.body.wallet.settlement.settledCount, 2);
  } finally {
    walletService.creditWallet = previousCreditWallet;
    freshRequire(userModelPath).findById = previousFindById;
    delete require.cache[require.resolve(topUpWalletPath)];
  }
});