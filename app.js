const express= require('express');
require("dotenv").config();
const mongoose=require('mongoose');
const morgan=require('morgan')
const bodyParser= require('body-parser')
const cookieParser= require('cookie-parser')
const expressValidator=require('express-validator')


//import routes
const userRoutes= require('./routes/user'); //for user

const authRoutes=require('./routes/auth'); //for authentication

const categoryRoutes= require('./routes/category'); //for category 



//app
const app=express()

//middlewares 
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());






//routes middleware 
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);


//database
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    //ssl:true,
   }).then(()=> console.log('DATABASE CONNECTED')); 





const port= process.env.PORT || 8000
app.listen(port,()=> {
    console.log('Server is running on port ${port}');
});




