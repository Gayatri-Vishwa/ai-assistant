

import express from 'express';
// import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import geminiResponse from './gemini.js';
dotenv.config();    
const app=express();

const PORT=process.env.PORT || 3000;



 let isConnected=false
async function connectDb() {
     if (isConnected) return;
    try{
        await mongoose.connect(process.env.MONGODB_URL ,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        isConnected=true;
        console.log("Connected to mongodb");
        
    }
    catch(error){
        console.error("Error connected to mongo db", error);
        
    }
}

// await connectDb(); // 🔥 FIRST
app.use(async (req, res, next) => {
  if (!isConnected) await connectDb();
  next();
});



// middleware
/* ✅ CORS FIRST */
app.use(
  cors({
    origin: [
        "http://localhost:5178", // ✅ ADD THIS
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);


    
app.use(express.json());
app.use(cookieParser())
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.get('/',async(req,resp)=>{
    let prompt=req.query.prompt
   let data=await  geminiResponse(prompt)
   resp.json(data)
})


// app.listen(PORT,()=>{
//     connectDb();
//     console.log(`Server is running on http://localhost:${PORT}`);
// });



// do not use app.listen in vercel

// module.exports=app
export default app;











// ================================/



// import express from 'express';
// import connectDb from './config/db.js';
// import authRouter from './routes/auth.routes.js';
// import cookieParser from 'cookie-parser';
// import userRouter from './routes/user.routes.js';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import geminiResponse from './gemini.js';
// dotenv.config();    
// const app=express();

// const PORT=process.env.PORT || 3000;

// // middleware
// app.use(cors({origin:['http://localhost:5173', 'http://localhost:5174']
//     ,credentials:true}));
// app.use(express.json());
// app.use(cookieParser())
// app.use('/api/auth',authRouter)
// app.use('/api/user',userRouter)

// app.get('/',async(req,resp)=>{
//     let prompt=req.query.prompt
//    let data=await  geminiResponse(prompt)
//    resp.json(data)
// })

// app.listen(PORT,()=>{
//     connectDb();
//     console.log(`Server is running on http://localhost:${PORT}`);
// });






