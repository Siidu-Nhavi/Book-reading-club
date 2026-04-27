const User = require("../../models/User.js");
const { DEFAULT_ACCOUNT_SETTINGS } = require("./getAccountSettings.js");

const DELIVERY_TYPES = new Set(["home", "pickup", "smart-locker"]);

function toBoolean(value, fallback) {
  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
}

function sanitizeSettings(input = {}) {
  const base = {
    ...DEFAULT_ACCOUNT_SETTINGS,
  };

  return {
    emailOrderUpdates: toBoolean(input.emailOrderUpdates, base.emailOrderUpdates),
    emailRecommendations: toBoolean(input.emailRecommendations, base.emailRecommendations),
    pushFlashDeals: toBoolean(input.pushFlashDeals, base.pushFlashDeals),
    smsDeliveryAlerts: toBoolean(input.smsDeliveryAlerts, base.smsDeliveryAlerts),
    oneClickCheckout: toBoolean(input.oneClickCheckout, base.oneClickCheckout),
    saveCardsForFasterCheckout: toBoolean(
      input.saveCardsForFasterCheckout,
      base.saveCardsForFasterCheckout,
    ),
    defaultDeliveryType: DELIVERY_TYPES.has(input.defaultDeliveryType)
      ? input.defaultDeliveryType
      : base.defaultDeliveryType,
    twoFactorAuth: toBoolean(input.twoFactorAuth, base.twoFactorAuth),
    allowNewDeviceLogin: toBoolean(input.allowNewDeviceLogin, base.allowNewDeviceLogin),
    marketingPersonalization: toBoolean(
      input.marketingPersonalization,
      base.marketingPersonalization,
    ),
  };
}

async function updateAccountSettings(req, res) {
  const payload =
    req.body && typeof req.body.settings === "object" && req.body.settings !== null
      ? req.body.settings
      : req.body;

  if (!payload || typeof payload !== "object") {
    return res.status(400).json({ error: "No settings payload was provided" });
  }

  try {
    const settings = sanitizeSettings(payload);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { accountSettings: settings } },
      {
        new: true,
        runValidators: true,
      },
    ).select("accountSettings");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Account settings updated",
      settings: {
        ...DEFAULT_ACCOUNT_SETTINGS,
        ...(user.accountSettings || {}),
      },
    });
  } catch (error) {
    console.error("Account settings update error:", error);
    return res.status(500).json({ error: "Unable to update account settings" });
  }
}

module.exports = { updateAccountSettings, sanitizeSettings };
