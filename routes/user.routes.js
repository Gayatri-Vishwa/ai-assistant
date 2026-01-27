import express from 'express';
import isAuth from '../middleware/isAuth.js';
import  {getCurrentUser, updateAssistant,askToAssistant } from '../controllers/user.controller.js';
import upload from '../middleware/multer.js'
import { clearHistory } from '../controllers/user.controller.js';

const router=express.Router();
router.get('/',(req,resp)=>{
    resp.post("yes  server fetched")
})
router.get('/current', isAuth, getCurrentUser);
router.post('/update',isAuth,upload.single("assistantImage"),updateAssistant) // upload is middleware ,img ko  req.file me dalega and will store in  public folder
router.post('/asktoassistant', isAuth, askToAssistant);
router.delete("/clear-history", isAuth, clearHistory);
export default router;