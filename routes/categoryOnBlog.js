import exp from "express";
import { authenticationTokenMiddleware } from "../middleware/authenticationToken.js";
import { createCategoryOnBlogs,getCategoryOnBlogById, getCategoryOnBlogs, deleteCategoryOnBlog, updateCategoryOnBlog } from "../controller/categoryOnBlog.js";

const router = exp.Router();

// Route to create a new categoryOnPost
router.post("/categoryOnBlogs", authenticationTokenMiddleware, createCategoryOnBlogs);
router.get("/categoryOnBlogs", authenticationTokenMiddleware, getCategoryOnBlogs);
router.get("/categoryOnBlogs/:id", authenticationTokenMiddleware, getCategoryOnBlogById);
router.delete("/categoryOnBlogs/:id", authenticationTokenMiddleware, deleteCategoryOnBlog);
router.put("/categoryOnBlogs/:id", authenticationTokenMiddleware, updateCategoryOnBlog);

export default router;