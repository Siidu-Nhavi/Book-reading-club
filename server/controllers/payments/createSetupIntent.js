const User = require("../../models/User.js");
const { getStripeClient } = require("../../services/stripeClient.js");
const { getOrCreateStripeCustomer } = require("../../services/stripeCustomer.js");

async function createSetupIntent(req, res) {
  try {
    const user = await User.findById(req.user._id).select("name email stripeCustomerId");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const stripe = getStripeClient();
    const customer = await getOrCreateStripeCustomer(user, stripe);
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      usage: "off_session",
      payment_method_types: ["card"],
    });

    return res.status(201).json({
      customerId: customer.id,
      clientSecret: setupIntent.client_secret,
    });
  } catch (error) {
    console.error("Create setup intent error:", error);
    return res.status(500).json({ error: "Unable to create setup intent" });
  }
}

module.exports = { createSetupIntent };
