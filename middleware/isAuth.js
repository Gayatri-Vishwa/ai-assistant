import jwt from 'jsonwebtoken';

const isAuth=async(req,resp,next)=>{
try {
       // Try cookies first
    let token = req.cookies?.token;
    // Fallback to Authorization header (Bearer token)
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return resp.status(401).json({ message: "Unauthorized" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.userId = decoded.userId;
    next();

   

} catch (error) {
    console.error("Authentication error:", error);

    return resp.status(500).json({message:"Unauthorized"});
}

}
export default isAuth;

