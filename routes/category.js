const express=require('express');
const router= express.Router();

const{ create,categoryById,read,update, remove ,list }= require("../controllers/category");
const{ requireSignin ,isAuth ,isAdmin}= require("../controllers/auth");
const{ userByID }= require("../controllers/user");




router.post(
    "/category/create/:userID",
    requireSignin,
    isAuth,
    isAdmin,
    create
); //product create ko lagi


router.put(
    "/category/:categoryId/:userID",
    requireSignin,
    isAuth,
    isAdmin,
    update
); //product update garna ko lagi


router.delete(
    "/category/:categoryId/:userID",
    requireSignin,
    isAuth,
    isAdmin,
    remove  
); //product delete ka lagi

router.get('/categories',list); //to get all the categories
router.get('/category/:categoryId',read);


router.param('categoryId',categoryById);
router.param("userID",userByID);



 
// router.get('/', (req,res)=> {                     //without using controller we can access the data through it
//     res.send("Hello from MERN Stack");
// });

module.exports=router;

