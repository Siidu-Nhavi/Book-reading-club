import { Router } from "express";

const router = Router();

//sample router
router.get("/", (req, res) => {
    res.send("user route");
});

export default router;