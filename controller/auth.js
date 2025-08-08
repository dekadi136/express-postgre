import "dotenv/config"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;


export async function register(request, response) {
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

    //  let user_final = {}
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

    // Return the created user
    return response.status(200).json(user_final);
  } catch (error) {
    console.error("Error creating user:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}
export async function login(request, response) {
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
