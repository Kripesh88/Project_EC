const User=require('../models/user');
const jwt=require('jsonwebtoken');//to generate signed token 
const expressJwt=require('express-jwt'); //authorization check 
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


exports.signin=(req,res)=>{
    //find the user based on email.
    const{email,password} =req.body;
    User.findOne({email}, ()=>{
        if(err || !user){
            return res.status(400).json({
                err:"User with that email doesnt exist. Please Signup."
            });
             
            //if user is found, We make sure that email and password match 
            //create authenticate method in user model.
            if(!user.authenticate(password)){
                return res.status(401).json({
                    error:'Email and password dont match'
                });
            }
            //generate a signed token with userID and secret
            const token=jwt.sign({id: user._id}, process.env.JWT_SECRET)

            //persist the token as 't' in cookie with expiry date

            res.cookie('t',token, {expire: new Date()+ 9999})
            
            //return response with user and token to frontend client
            
            const{_id, name,email,role}=user
            return res.json({token, user:{_id,email,name,role}});

            


        };
    });
};