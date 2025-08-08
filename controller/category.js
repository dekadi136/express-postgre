import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

// createCategory function to handle Category creation
export async function createCategories(request, response) {
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
export async function getCategories(request, response) {
  try {
    const category = await prisma.category.findMany({
      include:{
        categoryOnBlogs: {
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
export async function getCategoryById(request, response) {
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
        categoryOnBlogs: {
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
export async function deleteCategory(request, response) {
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
export async function updateCategory(request, response) {
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