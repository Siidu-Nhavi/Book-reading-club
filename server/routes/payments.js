const express = require("express");
const { getPaymentMethods } = require("../controllers/payments/getPaymentMethods.js");
const { createSetupIntent } = require("../controllers/payments/createSetupIntent.js");
const { setDefaultPaymentMethod } = require("../controllers/payments/setDefaultPaymentMethod.js");
const { removePaymentMethod } = require("../controllers/payments/removePaymentMethod.js");
const { requireAuth } = require("../middleware/auth.js");

const router = express.Router();

router.get("/methods", requireAuth, getPaymentMethods);
router.post("/setup-intent", requireAuth, createSetupIntent);
router.put("/default", requireAuth, setDefaultPaymentMethod);
router.delete("/methods/:id", requireAuth, removePaymentMethod);

module.exports = router;
