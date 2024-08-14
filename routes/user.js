const express=require('express');
const router= express.Router();


const{ requireSignin ,isAuth ,isAdmin}= require("../controllers/auth");

const{ userByID ,productById,read,update }= require("../controllers/user");


router.get('/secret/:userId',requireSignin,isAuth,isAdmin, (req,res)=>{
    console.log("Hre!!!")
    res.json({
        user: req.profile
    })
});


router.get('/user/:userId',requireSignin,isAuth,read);
router.put('/user/:userId',requireSignin,isAuth,update);

// In routes/user.js
router.param("userId", (req, res, next, id) => {
    console.log("router.param called with ID:", id);
    userByID(req, res, next, id); // Call userByID directly for debugging
});



module.exports=router;

