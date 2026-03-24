import { Router } from "express";
import { register } from "../controllers/auth/register.js";

const router = Router();

//register route
router.post("/register", register);

export default router;