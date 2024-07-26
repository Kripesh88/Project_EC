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

 