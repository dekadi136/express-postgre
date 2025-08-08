import "dotenv/config"
import exp from "express";
const server = exp();
const port = process.env.PORT || 3000;
import authRoutes from "./routes/auth.js"
import usersRoutes from "./routes/user.js"
import blogsRoutes from "./routes/blog.js"
import categoriesRoutes from "./routes/category.js"
import biodatasRoutes from "./routes/biodata.js"
import categoryOnBlogsRoutes from "./routes/categoryOnBlog.js"
import cors from "cors";

server.use(cors());

// Middleware to parse JSON bodies
server.use(exp.json());
server.use(exp.urlencoded({ extended: true }));

// AUTH USERS
server.use("/auth", authRoutes)

// USERS CRUD
server.use(usersRoutes)

// BLOGS CRUD
server.use(blogsRoutes)

// BIODATAS CRUD
server.use(biodatasRoutes)

// CATEGORIES CRUD
server.use(categoriesRoutes)

// CATEGORYONBLOGS CRUD
server.use(categoryOnBlogsRoutes)


function startServer() {
  console.log("Server is running on port " + port);
}
server.listen(port, startServer);

export default server;