import { Router } from "express";
import { register } from "../controllers/auth/register.js";
import { login } from "../controllers/auth/login.js";


const router = Router();

//register user
router.post("/register", register);

//login user
router.post("/login", login);
export default router;