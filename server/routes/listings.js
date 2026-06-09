const express = require("express");
const { requireAuth, requireNotSuspended } = require("../middleware/auth.js");
const { createListing } = require("../controllers/listings/createListing.js");
const { getMyListings } = require("../controllers/listings/getMyListings.js");
const { updateListing } = require("../controllers/listings/updateListing.js");
const { deleteListing } = require("../controllers/listings/deleteListing.js");

const router = express.Router();

router.post("/", requireAuth, requireNotSuspended, createListing);
router.get("/my", requireAuth, getMyListings);
router.put("/:id", requireAuth, requireNotSuspended, updateListing);
router.delete("/:id", requireAuth, requireNotSuspended, deleteListing);

module.exports = router;
