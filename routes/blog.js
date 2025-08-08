import exp from "express";
import { authenticationTokenMiddleware } from "../controller/authenticationToken.js";
import { createBlogs, getBlogs, getBlogById, deleteBlog, updateBlog } from "../controller/blog.js";
const router = exp.Router()



router.post("/blogs", authenticationTokenMiddleware, createBlogs);
router.get("/blogs", authenticationTokenMiddleware, getBlogs);
router.get("/blogs/:id", authenticationTokenMiddleware, getBlogById);
router.delete("/blogs/:id", authenticationTokenMiddleware, deleteBlog);
router.put("/blogs/:id", authenticationTokenMiddleware, updateBlog);

export default router;