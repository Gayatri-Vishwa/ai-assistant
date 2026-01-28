// import multer from 'multer';  // to handle file uploads in public folder

// const storage=multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,'./public')
//     },
//     filename:(req,file,cb)=>{
//         cb(null,file.originalname)
//     }
// })

// const upload=multer({storage:storage});

// export default upload;



import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
