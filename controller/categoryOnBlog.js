import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function getCategoryOnBlogs(request, response) {
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

export async function createCategoryOnBlogs(request, response) {
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

export async function getCategoryOnBlogById(request, response) {
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

export async function deleteCategoryOnBlog(request, response) {
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

export async function updateCategoryOnBlog(request, response) {
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