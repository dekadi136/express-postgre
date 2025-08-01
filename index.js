import exp from "express";
const server = exp();
const port = 3004;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const secret = "dadjasdjalksd"
import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

// Middleware to parse JSON bodies
server.use(exp.json());
server.use(exp.urlencoded({ extended: true }));

// Route to create a new user
// server.post("/users", createUser);
// server.get("/users", authenticationTokenMiddleware, getUsers);
server.get("/users", authenticationTokenMiddleware, getUserByEmail);
server.delete("/users/:email", deleteUser);
server.put("/users/:email", updateUser);

// getUserEmail function to handle fetching a user by email
async function getUserByEmail(request, response) {
  // const email = request.params.email;
  // if (!email || email.trim() === "") {
  //   return response.status(400).json({ error: "Email is required" });
  // }

  try {
    const where = {
      id: +request.user.userId,
    };
    // Fetch the user by email from the database using Prisma
    const user = await prisma.user.findUnique({
      where: where,
      include: {
        biodata:true
      }
    });
    return response.status(200).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// getUsers function to handle fetching all users
async function getUsers(request, response) {
  try {
    const users = await prisma.user.findMany({
      include: {
        biodata: true,
        blogs: true,
      }}
    );
    return response.status(200).json(users);
  } catch (error) {
    console.error("Error creating user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// createUser function to handle user creation
async function createUser(request, response) {
  const body = request.body;

  //validate user input, for example, check if email is provided, email is not empty, etc.
  if (!body.email || body.email.trim() === "") {
    return response.status(400).json({ error: "Email is required" });
  }

  if (!body.name || body.name.trim() === "") {
    return response.status(400).json({ error: "Name cannot be empty" });
  }

  try {
    //create a new user in the database
    const userData = {
      email: body.email,
      name: body.name,
    };

    // Create the user in the database using Prisma
    const user = await prisma.user.create({
      data: userData,
    });

    // Return the created user
    return response.status(200).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// Register

server.post("/register", register);

async function register(request, response) {
  const body = request.body;

  //validate user input, for example, check if email is provided, email is not empty, etc.
  if (!body.email || body.email.trim() === "") {
    return response.status(400).json({ error: "Email is required" });
  }

  // if (!body.name || body.name.trim() === "") {
  //   return response.status(400).json({ error: "Name cannot be empty" });
  // }

  if (!body.password || body.password.trim() === "") {
    return response.status(400).json({ error: "Password cannot be empty" });
  }

  if(body.password.length < 6){
    return response.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  try {
    //create a new user in the database
    const hash = bcrypt.hashSync(body.password, 5);

    const userData = {
      email: body.email,
      name: body.name,
      password: hash
    };

    // Create the user in the database using Prisma
    const user = await prisma.user.create({
      data: userData,
    });

    // Return the created user
    return response.status(200).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// Login

server.post("/login", login);

async function login(request, response) {
  const body = request.body;

  //validate user input, for example, check if email is provided, email is not empty, etc.
  if (!body.email || body.email.trim() === "") {
    return response.status(400).json({ error: "Email is required" });
  }

  // if (!body.name || body.name.trim() === "") {
  //   return response.status(400).json({ error: "Name cannot be empty" });
  // }

  if (!body.password || body.password.trim() === "") {
    return response.status(400).json({ error: "Password cannot be empty" });
  }

  if(body.password.length < 6){
    return response.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  try {

    // Create the user in the database using Prisma
    const user = await prisma.user.findUnique({
      where:{
        email: body.email.trim()
      }
    });

    if(!user){
      return response.status(400).json({ error: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(body.password, user.password)

    if(!isPasswordValid){
      return response.status(400).json({ error: "User not found" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        userName: user.name,
        email: user.email
      }, secret
    )

    // Return the created user
    return response.status(200).json(token);
  } catch (error) {
    console.error("Error creating user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}


async function authenticationTokenMiddleware(request, response, next) {
  const token = request.headers["token"];

  console.log(token)
  
  if(!token || token.trim() === ""){
    return response.status(400).json({ error: "Token is required" });  
  }
  

  try {

    const verifiedToken = jwt.verify(token, secret);

    console.log(verifiedToken)

    if(!verifiedToken || !verifiedToken.userId){
      return response.status(400).json({ error: "Invalid Token" }); 
    }

    request.user = {
      userId: verifiedToken.userId,
      email: verifiedToken.email
    };

    console.log(request.user)

    next();
  } catch (error) {
    console.error("Error creating user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}




// deleteUser function to handle user deletion
async function deleteUser(request, response) {
  const email = request.params.email;
  if (!email || email.trim() === "") {
    return response.status(400).json({ error: "Email is required" });
  }
  try {
    const where = {
      email: email.trim(),
    };
    // Delete the user by email from the database using Prisma
    const user = await prisma.user.delete({
      where: where,
    });
    return response.status(200).json(user);
  } catch (error) {
    console.error("Error deleting user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// updateUser function to handle user updates
async function updateUser(request, response) {
  const email = request.params.email;
  const body = request.body;

  if (!email || email.trim() === "") {
    return response.status(400).json({ error: "Email is required" });
  }

  if (!body.name || body.name.trim() === "") {
    return response.status(400).json({ error: "Name cannot be empty" });
  }

  try {
    const where = {
      email: email.trim(),
    };
    // Update the user by email in the database using Prisma
    const user = await prisma.user.update({
      where: where,
      data: {
        name: body.name,
      },
    });
    return response.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// Route to create a new user
server.post("/blogs", createBlogs);
server.get("/blogs", getBlogs);
server.get("/blogs/:id", getBlogById);
server.delete("/blogs/:id", deleteBlog);
server.put("/blogs/:id", updateBlog);

// createBlog function to handle blog creation
async function createBlogs(request, response) {
  const body = request.body;

  //validate user input, for example, check if email is provided, email is not empty, etc.
  if (!body.title || body.title.trim() === "") {
    return response.status(400).json({ error: "Title is required" });
  }

  if (!body.content || body.content.trim() === "") {
    return response.status(400).json({ error: "Content cannot be empty" });
  }

  try {
    //create a new user in the database
    const blogData = {
      title: body.title,
      content: body.content,
      userId: +body.userId
    };

    // Create the user in the database using Prisma
    const blog = await prisma.blog.create({
      data: blogData,
    });

    // Return the created user
    return response.status(200).json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// getBlog function to handle fetching all blogs
async function getBlogs(request, response) {
  try {
    const blogs = await prisma.blog.findMany({
      include:{
        user: true,
        categoryOnBlog: {
          include: {
            category: true
          }
        }
      }
    });
    return response.status(200).json(blogs);
  } catch (error) {
    console.error("Error getting blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// getBlogById function to handle fetching all blogs
async function getBlogById(request, response) {
  const blogId = +request.params.id;

  if (!blogId || isNaN(blogId)) {
    return response
      .status(400)
      .json({ error: "Please enter your ID correctly" });
  }

  try {
    const where = {
      id: blogId,
    };
    // Fetch the blog by email from the database using Prisma
    const blogs = await prisma.blog.findUnique({
      where: where,
      include:{
        categories: true
      }
    });
    return response.status(200).json(blogs);
  } catch (error) {
    console.error("Error getting blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// updateBlog function to handle user updates
async function updateBlog(request, response) {
  const idBlog = +request.params.id;
  const body = request.body;
  // const title = request.body.title;
  // const content = request.body.content;

  if (!idBlog || isNaN(idBlog)) {
    return response
      .status(400)
      .json({ error: "Please enter your ID correctly" });
  }

  if (!body.title || body.title.trim() === "") {
    return response.status(400).json({ error: "Title is required" });
  }

  if (!body.content || body.content.trim() === "") {
    return response.status(400).json({ error: "Content cannot be empty" });
  }

  try {
    const where = {
      id: idBlog,
    };
    // Update the user by email in the database using Prisma
    const blog = await prisma.blog.update({
      where: where,
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return response.status(200).json(blog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// deleteBlog function to handle user deletion
async function deleteBlog(request, response) {
  const idBlog = +request.params.id;

  if (!idBlog || isNaN(idBlog)) {
    return response
      .status(400)
      .json({ error: "Please enter your ID correctly" });
  }

  try {
    const where = {
      id: idBlog,
    };
    // Delete the blog by email from the database using Prisma
    const blog = await prisma.blog.delete({
      where: where,
    });
    return response.status(200).json(blog);
  } catch (error) {
    console.error("Error deleting user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// Route to create a new categories
server.post("/categories", createCategories);
server.get("/categories", getCategories);
server.get("/categories/:id", getCategoryById);
server.delete("/categories/:id", deleteCategory);
server.put("/categories/:id", updateCategory);

// createCategory function to handle Category creation
async function createCategories(request, response) {
  const body = request.body;

  //validate user input, for example, check if email is provided, email is not empty, etc.
  if (!body.name || body.name.trim() === "") {
    return response.status(400).json({ error: "Name cannot be empty" });
  }

  try {
    //create a new user in the database
    const categoryData = {
      name: body.name,
    };

    // Create the user in the database using Prisma
    const category = await prisma.category.create({
      data: categoryData,
    });

    // Return the created user
    return response.status(200).json(category);
  } catch (error) {
    console.error("Error creating blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// getcategory function to handle fetching all categorys
async function getCategories(request, response) {
  try {
    const category = await prisma.category.findMany({
      include:{
        categoryOnBlog: {
          include: {
            blog: true
          }
        }
      }
    });
    return response.status(200).json(category);
  } catch (error) {
    console.error("Error getting category:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// getCategoryById function to handle fetching all categorys
async function getCategoryById(request, response) {
  const idCategory = +request.params.id;

  if (!idCategory || isNaN(idCategory)) {
    return response
      .status(400)
      .json({ error: "Please enter your ID correctly" });
  }

  try {
    const where = {
      id: idCategory,
    };

    const category = await prisma.category.findUnique({
      where: where,
      include:{
        categoryOnBlog: {
          include: {
            blog: true
          }
        }
      }
    });
    return response.status(200).json(category);
  } catch (error) {
    console.error("Error getting category:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// deleteCategory function to handle fetching all categorys
async function deleteCategory(request, response) {
  const idCategory = +request.params.id;

  if (!idCategory || isNaN(idCategory)) {
    return response
      .status(400)
      .json({ error: "Please enter your ID correctly" });
  }

  try {
    const where = {
      id: idCategory,
    };

    const category = await prisma.category.delete({
      where: where,
    });
    return response.status(200).json(category);
  } catch (error) {
    console.error("Error getting category:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// updateCategory function to handle fetching all categorys
async function updateCategory(request, response) {
  const idCategory = +request.params.id;
  const body = request.body;

  if (!idCategory || isNaN(idCategory)) {
    return response
      .status(400)
      .json({ error: "Please enter your ID correctly" });
  }

  if (!body.name || body.name === "") {
    return response.status(400).json({ error: "Name cannot be empty" });
  }

  try {
    const where = {
      id: idCategory,
    };

    const category = await prisma.category.update({
      where: where,
      data: {
        name: body.name,
      },
    });
    return response.status(200).json(category);
  } catch (error) {
    console.error("Error getting category:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// Route to create a new biodata
server.post("/biodatas", createBiodata);
server.get("/biodatas", getBiodatas);
server.get("/biodatas/:nim", getBiodataByNim);
server.delete("/biodatas/:nim", deleteBiodata);
server.put("/biodatas/:nim", updateBiodata);

// createBiodata function to handle Biodata creation
async function createBiodata(request, response) {
  const body = request.body;

  //validate Biodata input, for example, check if email is provided, email is not empty, etc.
  if (!body.name || body.name.trim() === "") {
    return response.status(400).json({ error: "Name cannot be empty" });
  }

  if (!body.nim || body.nim.trim() === "") {
    return response.status(400).json({ error: "NIM is required" });
  }

  if (!body.tanggal_lahir || body.tanggal_lahir.trim() === "") {
    return response
      .status(400)
      .json({ error: "Tanggal lahir cannot be empty" });
  }

  if (!body.alamat || body.alamat.trim() === "") {
    return response.status(400).json({ error: "Alamat cannot be empty" });
  }

  if (!body.sudah_menikah || body.sudah_menikah.trim() === "") {
    return response.status(400).json({ error: "Status cannot be empty" });
  }

  let status = body.sudah_menikah;

  if (body.sudah_menikah === "true") {
    status = "Sudah";
  } else if (body.sudah_menikah === "false") {
    status = "Belum";
  }

  try {
    //create a new Biodata in the database
    const biodataData = {
      name: body.name,
      nim: body.nim,
      tanggal_lahir: new Date(body.tanggal_lahir),
      alamat: body.alamat,
      sudah_menikah: status,
      userId: request.user.userId
    };

    // Create the Biodata in the database using Prisma
    const biodata = await prisma.biodata.create({
      data: biodataData,
    });

    // Return the created Biodata
    return response.status(200).json(biodata);
  } catch (error) {
    console.error("Error creating blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function getBiodatas(request, response) {
  try {
    // Create the Biodata in the database using Prisma
    const biodata = await prisma.biodata.findMany();

    // Return the created Biodata
    return response.status(200).json(biodata);
  } catch (error) {
    console.error("Error creating biodata:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function getBiodataByNim(request, response) {
  const nim = request.params.nim;

  try {
    // Create the Biodata in the database using Prisma
    const where = {
      nim: nim,
    };
    const biodata = await prisma.biodata.findMany({
      where: where,
    });

    // Return the created Biodata
    return response.status(200).json(biodata);
  } catch (error) {
    console.error("Error creating blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function deleteBiodata(request, response) {
  const nim = request.params.nim;

  try {
    // Create the Biodata in the database using Prisma
    const where = {
      nim: nim,
    };
    const biodata = await prisma.biodata.delete({
      where: where,
    });

    // Return the created Biodata
    return response.status(200).json(biodata);
  } catch (error) {
    console.error("Error creating blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function updateBiodata(request, response) {
  const nim = request.params.nim;
  const body = request.body;

  if (!body.name || body.name.trim() === "") {
    return response.status(400).json({ error: "Name cannot be empty" });
  }

  // if (!body.nim || body.nim.trim() === "") {
  //   return response.status(400).json({ error: "NIM is required" });
  // }

  if (!body.tanggal_lahir || body.tanggal_lahir.trim() === "") {
    return response
      .status(400)
      .json({ error: "Tanggal lahir cannot be empty" });
  }

  if (!body.alamat || body.alamat.trim() === "") {
    return response.status(400).json({ error: "Alamat cannot be empty" });
  }

  if (!body.sudah_menikah || body.sudah_menikah.trim() === "") {
    return response.status(400).json({ error: "Status cannot be empty" });
  }

  let status = body.sudah_menikah;

  if (body.sudah_menikah === "true") {
    status = "Sudah";
  } else if (body.sudah_menikah === "false") {
    status = "Belum";
  }

  try {
    const where = {
      nim: nim,
    };
    //create a new Biodata in the database
    const biodataData = {
      name: body.name,
      nim: body.nim,
      tanggal_lahir: new Date(body.tanggal_lahir),
      alamat: body.alamat,
      sudah_menikah: status,
      userId: +body.userId
    };

    // Create the Biodata in the database using Prisma
    const biodata = await prisma.biodata.update({
      where: where,
      data: biodataData,
    });

    // Return the created Biodata
    return response.status(200).json(biodata);
  } catch (error) {
    console.error("Error creating blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// Route to create a new categoryOnPost
server.post("/categoryOnBlogs", createCategoryOnBlogs);
server.get("/categoryOnBlogs", getCategoryOnBlogs);
server.get("/categoryOnBlogs/:id", getCategoryOnBlogById);
server.delete("/categoryOnBlogs/:id", deleteCategoryOnBlog);
server.put("/categoryOnBlogs/:id", updateCategoryOnBlog);

async function getCategoryOnBlogs(request, response) {
  const body = request.body;

  try {
    //create a new user in the database
    // const categoryOnBlogData = {
    //   blogId: +body.blogId,
    //   categoryId: +body.categoryId
    // };

    // console.log(+body.caregoryId)

    // Create the user in the database using Prisma
    const categoryOnBlog = await prisma.categoryOnBlog.findMany();

    // Return the created user
    return response.status(200).json(categoryOnBlog);
  } catch (error) {
    console.error("Error creating categoryOnBlog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function createCategoryOnBlogs(request, response) {
  const body = request.body;

  //validate user input, for example, check if email is provided, email is not empty, etc.
  if (!body.blogId || !body.categoryId) {
    return response.status(400).json({ error: "Category ID and Blog ID is required" });
  }

  try {
    //create a new user in the database
    const categoryOnBlogData = {
      blogId: +body.blogId,
      categoryId: +body.categoryId
    };

    // console.log(+body.caregoryId)

    // Create the user in the database using Prisma
    const categoryOnBlog = await prisma.categoryOnBlog.create({
      data: categoryOnBlogData,
    });

    // Return the created user
    return response.status(200).json(categoryOnBlog);
  } catch (error) {
    console.error("Error creating categoryOnBlog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function getCategoryOnBlogById(request, response) {
  const CategoryOnBlogId = +request.params.id;

  //validate user input, for example, check if email is provided, email is not empty, etc.
  if (!CategoryOnBlogId || isNaN(CategoryOnBlogId)) {
    return response.status(400).json({ error: "Blog ID cannot be empty" });
  }

  try {
    //create a new user in the database
    // const categoryOnBlogData = {
    //   blogId: +body.blogId,
    //   categoryId: +body.categoryId
    // };

    // console.log(+body.caregoryId)

    // Create the user in the database using Prisma
    const categoryOnBlog = await prisma.categoryOnBlog.findUnique({
      where: {
        id: CategoryOnBlogId
      }
    });

    // Return the created user
    return response.status(200).json(categoryOnBlog);
  } catch (error) {
    console.error("Error creating categoryOnBlog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function deleteCategoryOnBlog(request, response) {
  const CategoryOnBlogId = +request.params.id;

  //validate user input, for example, check if email is provided, email is not empty, etc.
  if (!CategoryOnBlogId || isNaN(CategoryOnBlogId)) {
    return response.status(400).json({ error: "Blog ID cannot be empty" });
  }

  try {
    // Create the user in the database using Prisma
    const categoryOnBlog = await prisma.categoryOnBlog.delete({
      where: {
        id: CategoryOnBlogId
      }
    });

    // Return the created user
    return response.status(200).json(categoryOnBlog);
  } catch (error) {
    console.error("Error creating categoryOnBlog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function updateCategoryOnBlog(request, response) {
  const CategoryOnBlogId = +request.params.id;
  const body = request.body

  //validate user input, for example, check if email is provided, email is not empty, etc.
  if (!CategoryOnBlogId || isNaN(CategoryOnBlogId)) {
    return response.status(400).json({ error: "Blog ID cannot be empty" });
  }

   if (!body.blogId || !body.categoryId) {
    return response.status(400).json({ error: "Category ID and Blog ID is required" });
  }

  try {
    // Create the user in the database using Prisma
    const categoryOnBlogDatas = {
      blogId: +body.blogId,
      categoryId: +body.categoryId
    }
    const categoryOnBlog = await prisma.categoryOnBlog.update({
      where: {
        id: CategoryOnBlogId,
      },
      data: categoryOnBlogDatas
    });

    // Return the created user
    return response.status(200).json(categoryOnBlog);
  } catch (error) {
    console.error("Error creating categoryOnBlog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}


function startServer() {
  console.log("Server is running on port " + port);
}
server.listen(port, startServer);
