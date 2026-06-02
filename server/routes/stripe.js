const express = require("express");
const { handleStripeWebhook } = require("../controllers/stripe/webhook.js");

const router = express.Router();

router.post("/", handleStripeWebhook);

module.exports = router;
