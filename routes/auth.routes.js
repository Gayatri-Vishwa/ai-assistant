import express from 'express';
import { signin, logout, signUp } from '../controllers/auth.controller.js';

const authRouter=express.Router();


authRouter.post('/signup',signUp)    
authRouter.post('/signin',signin)    
authRouter.get('/logout',logout)    

export default authRouter;