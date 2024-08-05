const express=require('express');
const router= express.Router();

const{ create, productById ,read,remove }= require("../controllers/product");
const{ requireSignin ,isAuth ,isAdmin}= require("../controllers/auth");
const{ userByID }= require("../controllers/user");


router.get("/product/:productId",read);

router.post(
    "/product/create/:userID",
    requireSignin,
    isAuth,
    isAdmin,
    create
); 


router.delete('/product/:productId/:userID', 
    requireSignin,
    isAuth,
    isAdmin,
    remove
);

router.param("userID",userByID);
router.param("productId",productById);





 
// router.get('/', (req,res)=> {                     //without using controller we can access the data through it
//     res.send("Hello from MERN Stack");
// });

module.exports=router;

