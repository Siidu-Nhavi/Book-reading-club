const User = require("../../models/User.js");
const { getStripeClient } = require("../../services/stripeClient.js");
const { getOrCreateStripeCustomer } = require("../../services/stripeCustomer.js");

async function setDefaultPaymentMethod(req, res) {
  const paymentMethodId = typeof req.body.paymentMethodId === "string"
    ? req.body.paymentMethodId.trim()
    : "";

  if (!paymentMethodId) {
    return res.status(400).json({ error: "paymentMethodId is required" });
  }

  try {
    const user = await User.findById(req.user._id).select("name email stripeCustomerId");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const stripe = getStripeClient();
    const customer = await getOrCreateStripeCustomer(user, stripe);
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    if (!paymentMethod || paymentMethod.type !== "card") {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    if (paymentMethod.customer && paymentMethod.customer !== customer.id) {
      return res.status(403).json({ error: "Payment method does not belong to this customer" });
    }

    if (!paymentMethod.customer) {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });
    }

    const updatedCustomer = await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return res.status(200).json({
      customerId: updatedCustomer.id,
      defaultPaymentMethodId: updatedCustomer.invoice_settings?.default_payment_method || null,
    });
  } catch (error) {
    console.error("Set default payment method error:", error);
    return res.status(500).json({ error: "Unable to update default payment method" });
  }
}

module.exports = { setDefaultPaymentMethod };
