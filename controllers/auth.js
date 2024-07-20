const User=require('../models/user');
const jwt=require('jsonwebtoken');//to generate signed token 
const expressJwt=require('express-jwt'); //for authorization
require('dotenv').config(); //load environment variables from .env file
const {errorHandler} = require('../helpers/dbErrorHandler');


// exports.signup=async(req,res)=>{
//     console.log("req.body", req.body);
//    const user=new User(req.body); 
//    await user.save((err,user)=> {
//     if(err){
//         return res.status(400).json({
//             err
//         });
//     }
//     res.json({
//         user
//     });

//    })
// };
exports.signup = async (req, res) => {
    try {
        console.log("req.body", req.body);
        const user = new User(req.body);
        const savedUser = await user.save();
        savedUser.salt=undefined;  //will help to hide this context from nodemon
        savedUser.hashed_password=undefined; //hashed_password will be hidden in the nodemon
        res.json({
            user: savedUser
        });
    } 
    catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({
            error: errorHandler(error)
        });
      
    }
  
};


exports.signin=async(req,res)=>{
    //find the user based on email.
    const{ email:loginEmail,password} =req.body;

    User.findOne({ email:loginEmail })
    .then(User => {
        if (!User) {
            return res.status(400).json({
                err: "User with that email doesn't exist. Please Signup."
            });
        }
        
        // If user is found, we make sure that email and password match
        // Create authenticate method in user model.
        if (!User.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password dont match'
            });
        }
        
        // Proceed with your logic for successful authentication here
        // For example, you might generate a token and send it in the response
    })
    
    // User.findOne({email}, ()=>{
        //     if(err || !user){
            //         return res.status(400).json({
                //             err:"User with that email doesnt exist. Please Signup."
                //         });
                
    //         //if user is found, We make sure that email and password match 
    //         //create authenticate method in user model.
    //         if(!user.authenticate(password)){
        .catch(err => {
            return res.status(500).json({
                error: 'Something went wrong'
            });
        });
    //             return res.status(401).json({
    //                 error:'Email and password dont match'
    //             });
    //         }
            //generate a signed token with userID and secret
            const token=jwt.sign({id: User._id}, process.env.JWT_SECRET);

            //persist the token as 't' in cookie with expiry date

            res.cookie('t',token, {expire: new Date()+ 9999})
            
            //return response with user and token to frontend client
            
            const{_id, name, email:_loginEmail,role}=User
            return res.json({token, User:{_id,email:loginEmail,name,role}});

            

            
        };
        
        
       
    
    
        
        
        //for SIGNOUT
        exports.signout= (req,res)=>{
            res.clearCookie("t");
            res.json({message: 'Signout Successful'});
        };
        
        
        
        //Protecting routes
        exports.requireSignin=expressJwt.expressjwt({
                secret:process.env.JWT_SECRET,
                algorithms: ["HS256"], 
                userProperty:"auth",
        });