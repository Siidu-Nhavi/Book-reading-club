const express = require("express");
const { getCurrentUser } = require("../controllers/user/getCurrentUser.js");
const { updateProfile } = require("../controllers/user/updateProfile.js");
const { uploadAvatar } = require("../controllers/user/uploadAvatar.js");
const { requireAuth } = require("../middleware/auth.js");
const { uploadAvatar: uploadAvatarMiddleware } = require("../middleware/uploadAvatar.js");

const router = express.Router();

router.get("/me", requireAuth, getCurrentUser);
router.put("/me", requireAuth, updateProfile);
router.post(
	"/avatar",
	requireAuth,
	(req, res, next) => {
		uploadAvatarMiddleware.single("avatar")(req, res, (error) => {
			if (!error) {
				next();
				return;
			}

			const message = error.message || "Unable to upload avatar";
			const status = error.code === "LIMIT_FILE_SIZE" ? 400 : 422;
			res.status(status).json({ error: message });
		});
	},
	uploadAvatar,
);

module.exports = router;
