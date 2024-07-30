const mongoose=require('mongoose')
const { ObjectID }=mongoose.Schema;




const productSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    description:{
        type:String,
        required:true,
        maxlength:2000
    },
    price:{
        type:Number,
        trim:true,
        required:true,
        maxlength:32
    },
    category:{
        type: mongoose.Schema.ObjectId,
        ref:'Category',
        required:true
    },
    quantity:{
        type:Number,
    },
    photo:{
        data: Buffer,
        contentype:String
        
    },
    shipping: {
        required:false,
        type: Boolean
    },
 



},
{timestamps:true}
);


module.exports=mongoose.model("Product",productSchema);  //create a model name user and use it anywhere using userSchema