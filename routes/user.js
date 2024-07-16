const express=require('express');
const router= express.Router();

const{ signup }= require("../controllers/user");

router.post("/signup",signup);  //using controller
 
// router.get('/', (req,res)=> {                     //without using controller we can access the data through it
//     res.send("Hello from MERN Stack");
// });

module.exports=router;

