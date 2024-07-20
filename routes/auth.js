const express=require('express');
const router= express.Router();

const{ signup,signin,signout,requireSignin }= require("../controllers/auth");

const{ userSignupValidator }=require('../validator/index');


router.post("/signup",userSignupValidator, signup); 
router.post("/signin",signin);  //using controller
router.get("/signout",signout);



router.get("/hello",requireSignin,(req,res)=>{
    res.send("Hello there!!");
});
 
// router.get('/', (req,res)=> {                     //without using controller we can access the data through it
//     res.send("Hello from MERN Stack");
// });

module.exports=router;

