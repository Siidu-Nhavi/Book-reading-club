const Stripe = require("stripe");

let stripeClient = null;

function getStripeClient() {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is required");
    }
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2024-04-10",
    });
  }

  return stripeClient;
}

module.exports = { getStripeClient };
