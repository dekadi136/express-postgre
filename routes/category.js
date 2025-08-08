import exp from "express";
import { authenticationTokenMiddleware } from "../controller/authenticationToken.js";
import { createCategories, getCategories, getCategoryById, deleteCategory, updateCategory } from "../controller/category.js";

const router = exp.Router();


// Route to create a new categories
router.post("/categories", authenticationTokenMiddleware, createCategories);
router.get("/categories", authenticationTokenMiddleware, getCategories);
router.get("/categories/:id", authenticationTokenMiddleware, getCategoryById);
router.delete("/categories/:id", authenticationTokenMiddleware, deleteCategory);
router.put("/categories/:id", authenticationTokenMiddleware, updateCategory);

export default router;