import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;

export async function authenticationTokenMiddleware(request, response, next) {
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
      name: verifiedToken.userName,
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
