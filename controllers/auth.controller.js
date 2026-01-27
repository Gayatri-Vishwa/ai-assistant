import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";



export const signUp=async(req,resp)=>{
    try {
        const {name,email,password}=req.body;

        const existingUser=await User.findOne({email});
        if(existingUser){
            return resp.status(400).json({message:"User already exists"});
        }
        if(password.length<6){
            return resp.status(400).json({message:"Password must be at least 6 characters long"});
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=new User({
            name,
            email,
            password:hashedPassword,
        });

        const token =await genToken(user._id);
        // resp.cookie("token",token,{
        //     httpOnly:true,
        //     secure:false,
        //     sameSite:"strict",
        //     maxAge:7*24*60*60*1000,
        // });


         const isProd = process.env.NODE_ENV === "production";
    resp.cookie("token", token, {
      httpOnly: true,
      secure: isProd, // prod: true | local: false
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

        await user.save();
        resp.status(201).json({message:"User created successfully",user,token,});   

        
    } catch (error) {
        resp.status(500).json({message:"Internal server sign up error",error});
    }
}




export const signin=async(req,resp)=>{
    try {
        const {email,password}=req.body;

        const user=await User.findOne({email});
        if(!user){
            return resp.status(400).json({message:"Email does not exists"});
        }
        if(password.length<6){
            return resp.status(400).json({message:"Password must be at least 6 characters long"});
        }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return resp.status(400).json({message:"Invalid Password"});
    }

        const token =await genToken(user._id);
        // resp.cookie("token",token,{
        //     httpOnly:true,
        //     secure:false,
        //     sameSite:"strict",
        //     maxAge:7*24*60*60*1000,
        // });


         const isProd = process.env.NODE_ENV === "production";
    resp.cookie("token", token, {
      httpOnly: true,
      secure: isProd, // prod: true | local: false
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
        // await user.save();
        resp.status(200).json({message:"User login successfully",user,token,});   

        
    } catch (error) {
        resp.status(500).json({message:"Internal server login error",error});
    }
}


export const logout=async(re,resp)=>{
    try {
        resp.clearCookie("token");
        resp.status(200).json({message:"User logged out successfully"});
        
    } catch (error) {
          resp.status(500).json({message:"Internal server logout error",error});
    }
}