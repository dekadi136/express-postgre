import "dotenv/config"
import { register, login } from "../controller/auth.js";
import exp from "express";
// const server = exp();

const router = exp.Router();

router.post("/register", register);
router.post("/login", login);

export default router;