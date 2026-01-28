import jwt from 'jsonwebtoken';

const isAuth=async(req,resp,next)=>{
try {
    
    const token=req.cookies.token;
    // const token=req.cookies.token;
    if(!token){
        return resp.status(401).json({message:"Unauthorized"});
    }

    const decoded=  jwt.verify(token,process.env.JWT_SECRET);
    
    req.userId = decoded.id;

    next();
} catch (error) {
    console.error("Authentication error:", error);
    return resp.status(500).json({message:"Unauthorized"});
}

}
export default isAuth;



