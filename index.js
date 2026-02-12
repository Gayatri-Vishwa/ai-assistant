import dotenv from "dotenv";
dotenv.config();

import express from "express";
// import connectDb from './config/db.js';
import authRouter from "./routes/auth.routes.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

import cors from "cors";
import geminiResponse from "./gemini.js";

const app = express();

//new
app.set("trust proxy", 1);
const PORT = process.env.PORT || 10000;

let isConnected = false;
async function connectDb() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to mongodb");
  } catch (error) {
    console.error("Error connected to mongo db", error);
  }
}

// app.listen(PORT, async () => {
//   try {
//     await connectDb();
//     console.log("MongoDB connected");
//     console.log(`Server running on port ${PORT}`);
//   } catch (err) {
//     console.log(err);
//   }
// });



// Middleware to ensure DB connection before each request
app.use(async (req, res, next) => {
  if (!isConnected) await connectDb();
  next();
});
// middleware
/* ✅ CORS FIRST */
app.use(
  cors({
    origin: ["http://localhost:5178", process.env.CLIENT_URL],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", async (req, resp) => {
  let prompt = req.query.prompt;
  let data = await geminiResponse(prompt);
  resp.json(data);
});

// do not use app.listen in vercel

// module.exports=app
export default app;
