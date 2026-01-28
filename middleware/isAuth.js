import jwt from 'jsonwebtoken';

const isAuth=async(req,resp,next)=>{
try {
    
    // const token=req.cookies.token;
    console.log("AUTH COOKIES:", req.cookies);



    // const token=req.cookies.token;
    // if(!token){
    //     return resp.status(401).json({message:"Unauthorized"});
    // }
    // const decoded=  jwt.verify(token,process.env.JWT_SECRET);
    // //req.userId = decoded.id;
    // req.userId = decoded.userId;
    // next();

    // ================================
    // 1️⃣ Cookie token
  //   if (req.cookies?.token) {
  //     token = req.cookies.token;
  //   }

  //   // 2️⃣ Header token
  //   if (!token && req.headers.authorization?.startsWith("Bearer ")) {
  //     token = req.headers.authorization.split(" ")[1];
  //   }
  //  if (!token) {
  //     return resp.status(401).json({ message: "Unauthorized" });
  //   }

  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.userId = decoded.userId;

  //   next();
// ==================================================

let token = req.cookies?.token;

if (!token && req.headers.authorization?.startsWith("Bearer ")) {
  token = req.headers.authorization.split(" ")[1];
}

if (!token) {
  return resp.status(401).json({ message: "Unauthorized" });
}



} catch (error) {
    console.error("Authentication error:", error);

    return resp.status(500).json({message:"Unauthorized"});
}

}
export default isAuth;



