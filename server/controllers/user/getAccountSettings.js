const DEFAULT_ACCOUNT_SETTINGS = {
  emailOrderUpdates: true,
  emailRecommendations: true,
  pushFlashDeals: false,
  smsDeliveryAlerts: true,
  oneClickCheckout: false,
  saveCardsForFasterCheckout: true,
  defaultDeliveryType: "home",
  twoFactorAuth: false,
  allowNewDeviceLogin: true,
  marketingPersonalization: true,
};

function getAccountSettings(req, res) {
  const settings = {
    ...DEFAULT_ACCOUNT_SETTINGS,
    ...(req.user?.accountSettings || {}),
  };

  return res.status(200).json({ settings });
}

module.exports = {
  DEFAULT_ACCOUNT_SETTINGS,
  getAccountSettings,
};
