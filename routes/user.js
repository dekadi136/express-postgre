import "dotenv/config"
import exp from "express";
const server = exp();
// const port = 3004;
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// const secret = "dadjasdjalksd"
// const port = process.env.PORT;
// const secret = process.env.JWT_SECRET;
// import { PrismaClient } from "./generated/prisma/index.js";
import { getUserByUserId, getUsers, deleteUser, updateUser } from "../controller/user.js";
import { authenticationTokenMiddleware } from "../controller/authenticationToken.js";
// import authRoutes from "./routes/auth.js"

const router = exp.Router()

router.get("/users", authenticationTokenMiddleware, getUsers);
router.get("/user", authenticationTokenMiddleware, getUserByUserId);
router.delete("/users", authenticationTokenMiddleware, deleteUser);
router.put("/users", authenticationTokenMiddleware, updateUser);

export default router;