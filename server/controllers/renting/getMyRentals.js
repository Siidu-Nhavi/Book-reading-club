const Rental = require("../../models/Rental.js");
const { getRentalAlerts } = require("../../services/rentalFinanceService.js");
const { getWalletOverview } = require("../../services/walletService.js");

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

async function getMyRentals(req, res) {
  const page = toPositiveInteger(req.query.page, 1);
  const requestedLimit = toPositiveInteger(req.query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const status = req.query.status?.trim();

  const filters = { user: req.user._id };

  if (status) {
    filters.status = status;
  }

  try {
    const [rentals, totalRentals, alerts, walletOverview] = await Promise.all([
      Rental.find(filters)
        .populate("book", "title author image pricePerDay depositAmount isAvailable")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Rental.countDocuments(filters),
      getRentalAlerts(req.user._id),
      getWalletOverview(req.user._id),
    ]);

    return res.status(200).json({
      total: totalRentals,
      alerts,
      wallet: {
        balance: walletOverview.wallet.balance,
        pendingDuesTotal: walletOverview.pendingDuesTotal,
        heldRefundTotal: walletOverview.heldRefundTotal,
      },
      rentals,
    });
  } catch (error) {
    console.error("Get my rentals error:", error);
    return res.status(500).json({ error: "Unable to fetch rentals" });
  }
}

module.exports = { getMyRentals };
