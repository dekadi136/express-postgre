import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

// getUserEmail function to handle fetching a user by email
export async function getUserByUserId(request, response) {
  // const email = request.params.email;
  // if (!email || email.trim() === "") {
  //   return response.status(400).json({ error: "Email is required" });
  // }

  try {
    const where = {
      id: +request.user.userId,
    };
    
    // Fetch the user by email f
    // rom the database using Prisma
    const user = await prisma.user.findUnique({
      where: where,
      include: {
        biodata: true,
        blogs: true,
      }
    }); 

      // user[i].email
      // console.log(user[i].email)
      const sensor = "*";
      let [username, domain] = user.email.split("@");   
      // console.log([username, domain])    
      let huruf_awal = username.slice(0,3)
      username = huruf_awal + sensor.repeat(username.length-3);
      // console.log(username)  

      let email_fix = username+"@"+domain;
      // console.log(email_fix)  

      const user_final = {
        createdAt: user.createdAt,
        id: user.id,
        name: user.name,
        email: email_fix,
      }
    

    // const user = await prisma.user.findMany();
    return response.status(200).json(user_final);
  } catch (error) {
    console.error("Error creating user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export async function getUserById(request, response) {
  const id = +request.params.id;
  // if (!email || email.trim() === "") {
  //   return response.status(400).json({ error: "Email is required" });
  // }

  try {
    const where = {
      id: id,
    };
    // Fetch the user by email from the database using Prisma
    const user = await prisma.user.findUnique({
      where: where,
      include: {
        biodata: true,
        blogs: true,
      }
    }); 

      // user[i].email
      // console.log(user[i].email)
      const sensor = "*";
      let [username, domain] = user.email.split("@");   
      // console.log([username, domain])    
      let huruf_awal = username.slice(0,3)
      username = huruf_awal + sensor.repeat(username.length-3);
      // console.log(username)  

      let email_fix = username+"@"+domain;
      // console.log(email_fix)  

      const user_final = {
        createdAt: user.createdAt,
        id: user.id,
        name: user.name,
        email: email_fix,
      }
    

    // const user = await prisma.user.findMany();
    return response.status(200).json(user_final);
  } catch (error) {
    console.error("Error creating user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// getUsers function to handle fetching all users
export async function getUsers(request, response) {
  try {
    const users = await prisma.user.findMany({
      select:{
        createdAt:true,
        id:true,
        name: true,
        email: true,
        biodata: true,
        blogs: true,
      }

    }
    );

    let users_final = []

    for(let i=0; i<users.length; i++){
      // users[i].email
      // console.log(users[i].email)
      const sensor = "*";
      let [username, domain] = users[i].email.split("@");   
      // console.log([username, domain])   
      let huruf_awal = username.slice(0,3)
      username = huruf_awal + sensor.repeat(username.length-3);
      // console.log(username)  

      let email_fix = username+"@"+domain;
      // console.log(email_fix)  

      users_final.push( {
        createdAt: users[i].createdAt,
        id: users[i].id,
        name: users[i].name,
        email: email_fix,
        biodata: users[i].biodata,
        blogs: users[i].blogs
      })
    }
    // console.log(users_final)

    

    return response.status(200).json(users_final);
  } catch (error) {
    console.error("Error creating user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}
 
// deleteUser function to handle user deletion
export async function deleteUser(request, response) {
  const id = +request.params.id;
  // if (!email || email.trim() === "") {
  //   return response.status(400).json({ error: "Email is required" });
  // }

  try {
    const where = {
      id: id,
    };

    // console.log(where)
    // Delete the user by email from the database using Prisma
    const user = await prisma.user.delete({
      where: where,
    });

    const sensor = "*";
      let [username, domain] = user.email.split("@");   
      // console.log([username, domain])   
      let huruf_awal = username.slice(0,3)
      username = huruf_awal + sensor.repeat(username.length-3);
      // console.log(username)  

      let email_fix = username+"@"+domain;
      // console.log(email_fix)  

      const user_final = {
        createdAt: user.createdAt,
        id: user.id,
        name: user.name,
        email: email_fix,
      }

    return response.status(200).json(user_final);
  } catch (error) {
    console.error("Error deleting user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

// updateUser function to handle user updates
export async function updateUser(request, response) {
  const id = +request.params.id;
  const body = request.body;

  if (!body.email || body.email.trim() === "") {
    return response.status(400).json({ error: "Email is required" });
  }

  if (!body.name || body.name.trim() === "") {
    return response.status(400).json({ error: "Name cannot be empty" });
  }

  try {
    const where = {
      id: id,
    };
    // Update the user by email in the database using Prisma
    const user = await prisma.user.update({
      where: where,
      data: {
        name: body.name,
        email: body.email
      },
    });

    const sensor = "*";
      let [username, domain] = user.email.split("@");   
      // console.log([username, domain])   
      let huruf_awal = username.slice(0,3)
      username = huruf_awal + sensor.repeat(username.length-3);
      // console.log(username)  

      let email_fix = username+"@"+domain;
      // console.log(email_fix)  

      const user_final = {
        createdAt: user.createdAt,
        id: user.id,
        name: user.name,
        email: email_fix,
      }

    return response.status(200).json(user_final);
  } catch (error) {
    console.error("Error updating user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}