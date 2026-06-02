const User = require("../../models/User.js");
const { getStripeClient } = require("../../services/stripeClient.js");
const { getOrCreateStripeCustomer } = require("../../services/stripeCustomer.js");

async function removePaymentMethod(req, res) {
  const paymentMethodId = typeof req.params.id === "string"
    ? req.params.id.trim()
    : "";

  if (!paymentMethodId) {
    return res.status(400).json({ error: "payment method id is required" });
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

    await stripe.paymentMethods.detach(paymentMethodId);

    const updatedCustomer = await stripe.customers.retrieve(customer.id);
    const defaultPaymentMethodId =
      updatedCustomer.invoice_settings?.default_payment_method || null;

    if (defaultPaymentMethodId === paymentMethodId) {
      const methods = await stripe.paymentMethods.list({
        customer: customer.id,
        type: "card",
      });
      const nextDefault = methods.data?.[0]?.id || null;
      await stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: nextDefault,
        },
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Remove payment method error:", error);
    return res.status(500).json({ error: "Unable to remove payment method" });
  }
}

module.exports = { removePaymentMethod };
