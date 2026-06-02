const User = require("../models/User.js");

async function getOrCreateStripeCustomer(user, stripe) {
  if (user.stripeCustomerId) {
    try {
      const existingCustomer = await stripe.customers.retrieve(user.stripeCustomerId);
      if (existingCustomer && !existingCustomer.deleted) {
        return existingCustomer;
      }
    } catch (error) {
      console.error("Stripe customer lookup failed:", error);
    }
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: String(user._id),
    },
  });

  await User.updateOne({ _id: user._id }, { $set: { stripeCustomerId: customer.id } });

  return customer;
}

module.exports = { getOrCreateStripeCustomer };
