const { model } = require('mongoose');
const User=require('../models/user')


 

// Define userByID function using async/await
exports.userByID = async (req, res, next,id) => {
    try {
        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user; // Adds user profile to the request object
        next(); // Continue to the next middleware
    } catch (err) {
        return res.status(400).json({
            error: 'Error fetching user'
        });
    }
};

 exports.read=(req,res) => {

        req.profile.hashed_password=undefined;
        req.profile.salt=undefined;
        return res.json(req.profile);
 }

//  exports.update=(req,res)=>{
//     User.findOneAndUpdate({_id:req.profile._id} , 
//         {$set:req.body}, 
//         {new:true},
//         (err,user)=>{
//             if(err){
//                 return res.status(400).json({
//                     error:"You are not authorized to perform this action"
//                 });
//             }
//             user.hashed_password=undefined;
//             user.salt=undefined;
//             res.json(user);
//         }
//     );
//  };
exports.update = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.profile._id },
            { $set: req.body },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({
                error: "You are not authorized to perform this action",
            });
        }

        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    } catch (err) {
        res.status(400).json({
            error: "An error occurred while updating the user",
        });
    }
};
