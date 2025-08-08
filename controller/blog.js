import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

// createBlog function to handle blog creation
export async function createBlogs(request, response) {
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
      userId: +request.user.userId
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
export async function getBlogs(request, response) {
  try {
    const blogs = await prisma.blog.findMany({
      include:{
        user: {
          select:{
          name: true,
          email: true
          }
        },
        categories: {
          include:{
            category: true
          }
        }
        // categoryOnBlog: {
        //   include: {
        //     category: true
        //   }
        // }
      }
    });
    // console.log(blogs[1].user.email)
    let blogs_final = []

    for(let i=0; i<blogs.length; i++){
      // users[i].email
      // console.log(users[i].email)
      const sensor = "*";
      let [username, domain] = blogs[i].user.email.split("@");   
      // console.log([username, domain])   
      let huruf_awal = username.slice(0,3)
      username = huruf_awal + sensor.repeat(username.length-3);
      // console.log(username)  

      let email_fix = username+"@"+domain;
      // console.log(email_fix)   

      blogs_final.push( { 
        createdAt: blogs[i].createdAt,
        id: blogs[i].id,
        title: blogs[i].title,
        content: blogs[i].title,
        user:{
          name: blogs[i].user.name,
          email:  email_fix
        },
        categories: blogs[i].categories,
      })
    }
    // console.log()

    return response.status(200).json(blogs_final);
  } catch (error) {
    console.error("Error getting blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// getBlogById function to handle fetching all blogs
export async function getBlogById(request, response) {
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
        user: {
          select:{
          name: true,
          email: true
          }
        },
        categories: { 
          include:{
          category:true
          }
        }
      }
    });

      // users[i].email
      // console.log(users[i].email)
      const sensor = "*";
      let [username, domain] = blogs.user.email.split("@");   
      // console.log([username, domain])   
      let huruf_awal = username.slice(0,3)
      username = huruf_awal + sensor.repeat(username.length-3);
      // console.log(username)  

      let email_fix = username+"@"+domain;
      // console.log(email_fix)  

      const blogs_final = {
        createdAt: blogs.createdAt,
        id: blogs.id,
        title: blogs.title,
        content: blogs.title,
        user:{
          name: blogs.user.name,
          email:  email_fix
        },
        categories: blogs.categories,
      }
    
      const blogIdUser = await prisma.blog.findUnique({
        where: where
      })

    if(blogIdUser.userId !== request.user.userId){
      return response.status(500).json({ error: "Unknown authorize" });
    }

    console.log(blogs)


      if(blogs.userId !== request.user.userId){
        return response.status(500).json({ error: "Unknown authorize" });
      }

    return response.status(200).json(blogs_final);
  } catch (error) {
    console.error("Error getting blog:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// updateBlog function to handle user updates
export async function updateBlog(request, response) {
  const blogId = +request.params.id;
  const body = request.body;
  // const title = request.body.title;
  // const content = request.body.content;

  // if (!blogId || isNaN(blogId)) {
  //   return response
  //     .status(400)
  //     .json({ error: "Please enter your ID correctly" });
  // }

  if (!body.title || body.title.trim() === "") {
    return response.status(400).json({ error: "Title is required" });
  }

  if (!body.content || body.content.trim() === "") {
    return response.status(400).json({ error: "Content cannot be empty" });
  }
  // console.log(blogId)

  try {
    const where = {
      id: blogId,
    };
    // Sebelum aku update, ke database aku cek blog dengan idUser
    // Update the user by email in the database using Prisma

    // Sebelum aku update aku mau get blog dengan id dari params, Kalau useridnya sama dengan userId yang dari login

    const blogIdUser = await prisma.blog.findUnique({
      where: where
    });

    if(blogIdUser.userId !== request.user.userId){
      return response.status(500).json({ error: "Unknown authorize" });
    }

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
export async function deleteBlog(request, response) {
  const blogId = +request.params.id;

  // if (!idBlog || isNaN(idBlog)) {
  //   return response
  //     .status(400)
  //     .json({ error: "Please enter your ID correctly" });
  // }

  try {
    const where = {
      id: blogId,
    };
    // Delete the blog by email from the database using Prisma
    const blogIdUser = await prisma.blog.findUnique({
      where: where
    });

    if(blogIdUser.userId !== request.user.userId){
      return response.status(500).json({ error: "Unknown authorize" });
    }

    const blog = await prisma.blog.delete({
      where: where,
    });
    return response.status(200).json(blog);
  } catch (error) {
    console.error("Error deleting user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}