const express=require('express');
const router= express.Router();

const{ create, productById ,read,remove,update,list,listRelated,listBySearch }= require("../controllers/product");
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


router.delete('/product/:productId/:userID',  //for deletion
    requireSignin,
    isAuth,
    isAdmin,
    remove
);

router.put('/product/:productId/:userID', //update 
    requireSignin,
    isAuth,
    isAdmin,
    update
);

router.get('/products',list);
router.get('/products/related/:productId',listRelated);
router.post("/products/by/search", listBySearch);

router.param("userID",userByID);
router.param("productId",productById);





 
// router.get('/', (req,res)=> {                     //without using controller we can access the data through it
//     res.send("Hello from MERN Stack");
// });

module.exports=router;

