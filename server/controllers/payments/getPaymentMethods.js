const User = require("../../models/User.js");
const { getStripeClient } = require("../../services/stripeClient.js");
const { getOrCreateStripeCustomer } = require("../../services/stripeCustomer.js");

async function getPaymentMethods(req, res) {
  try {
    const user = await User.findById(req.user._id).select("name email stripeCustomerId");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const stripe = getStripeClient();
    const customer = await getOrCreateStripeCustomer(user, stripe);
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });

    return res.status(200).json({
      customerId: customer.id,
      defaultPaymentMethodId: customer.invoice_settings?.default_payment_method || null,
      methods: paymentMethods.data.map((method) => ({
        id: method.id,
        brand: method.card?.brand || "",
        last4: method.card?.last4 || "",
        expMonth: method.card?.exp_month || null,
        expYear: method.card?.exp_year || null,
        funding: method.card?.funding || "",
        country: method.card?.country || "",
      })),
    });
  } catch (error) {
    console.error("Get payment methods error:", error);
    return res.status(500).json({ error: "Unable to fetch payment methods" });
  }
}

module.exports = { getPaymentMethods };
