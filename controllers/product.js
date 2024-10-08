// const formidable=require('formidable');
// const _ = require("lodash");
// const fs=require('fs');
// const path=require('path');
// const Product = require("../models/product");
// const { errorHandler }=require("../helpers/dbErrorHandler");
// const { type } = require('os');



// exports.create=(req,res)=>{
//     const uploadDir = path.join(__dirname, '../uploads');

//     // Ensure the uploads directory exists
//     if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     let form=new formidable.IncomingForm({
//     keepExtensions:true,
//     maxFileSize:10*1024*1024,
//     multiples: true, // allow multiple files
//     uploadDir: uploadDir // specify an upload directory //max size limit=10MB

//     });
//     // form.keepExtensions=true;
//     // form.maxFileSize= 10*1024*1024;
//     // multiples: true, // allow multiple files
//     // uploadDir: 'path_to_temp_directory' // specify an upload directory //max size limit=10MB

//     // const{name,description,price, category,quantity,shipping}=fields;
//     // if(!name|| !description || !price || !category || !quantity ||!shipping){
//     //     return res.status(400).json({
//     //         error:"All the fields are required"
//     //     });
//     // };
//     form.parse(req,(err,fields,files)=>{
//         console.error("Formidable error: ",err);
//         if(err){
//             return res.status(400).json({
//                 error:"Image could not be uploaded"
//             })
//         }
//         console.log("Fields:", fields);
//         console.log("Files:", files);
//         console.log("path: ",path);
     

//         let product= new Product(fields);

//         if(files.photo){
            
//             console.log("FILES PHOTO:", files.photo);

//             // Ensure the photo object is correctly accessed
//             const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;
            
            
//             if (!photo || !photo.filepath) {
//                 return res.status(400).json({
//                     error: 'File path is missing. Please ensure the file is properly uploaded.'
//                 });
//             }

//             console.log('Photo object:', photo);
//             console.log('Photo path:', photo.filepath);
//             console.log('Photo type:', photo.mimetype);
            

//             // console.log("Photo object:", photo); // Log photo object for debugging

            

//             // // Add extra logging for photo object properties
//             // console.log("Photo path:", photo.path);
//             // console.log("Photo type:", photo.type);
           
//                 // if (!files.photo.path) {
//                 //     return res.status(400).json({
//                 //         error: "File path is missing. Please ensure the file is properly uploaded."
//                 //     });
//                 // }
//             try{
//             // product.photo.data= fs.readFileSync(files.photo.path);
//             // product.photo.contentType=files.photo.type;
//             product.photo.data = fs.readFileSync(photo.filepath);
//             product.photo.contentType = photo.mimetype;
//         }catch(readError){
//             console.error("File system error: ", readError);
//                 return res.status(400).json({
//                     error: "Image could not be uploaded"
//                 });
//         }
//     }

//         // product.save((err,result)=>{
//         //     if(err){
//         //         return res.status(400).json({
//         //             error: errorHandler(err) 
//         //         });
//         //     }
//         //     res.json(result);
//         // });
    //     product.save()
    // .then(result => {
    //     res.json(result);
    // })
    // .catch(err => {
    //     console.error("Error saving product: ", err);
    //     res.status(400).json({
    //         error: errorHandler(err)
    //     });
    // });
//     });
// };











// exports.create = async (req, res) => {
//     const category = new Category(req.body);
//     try {
//         const data = await category.save();
//         res.json({ data });
//     } catch (err) {
//         res.status(400).json({
//             error: errorHandler(err)
//         });
//     }
// };
  /* Alternative choice for callback 
  const Category = require("../models/category");
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save()
        .then(data => {
            res.json({ data });
        })
        .catch(err => {
            res.status(400).json({
                error: errorHandler(err)
            });
        });
};
*/

const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require("../helpers/dbErrorHandler");


exports.productById = async (req, res, next, id) => {
    try {
        const product = await Product.findById(id).exec();
        if (!product) {
            return res.status(400).json({
                error: "Product Not Found"
            });
        }
        req.product = product;
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Product is Not available"
        });
    }
};


exports.read=(req,res)=>{ //for read in routes as route.get
    req.product.photo= undefined;
    return res.json(req.product);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image couldn\'t be uploaded'
            });
        }

        // Convert form fields to correct types
        fields.name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
        fields.description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
        fields.price = Array.isArray(fields.price) ? parseFloat(fields.price[0]) : parseFloat(fields.price);
        fields.quantity = Array.isArray(fields.quantity) ? parseInt(fields.quantity[0], 10) : parseInt(fields.quantity, 10);
        fields.shipping = Array.isArray(fields.shipping) ? (fields.shipping[0] === 'true') : (fields.shipping === 'true');

        let product = new Product(fields);

        if (files.photo && Array.isArray(files.photo) && files.photo.length > 0) {
     
            let photo = files.photo[0]; // Access the first element of the array
            if (typeof photo.filepath === 'string' && fs.existsSync(photo.filepath)) {
                try {
                    product.photo.data = fs.readFileSync(photo.filepath);
                    product.photo.contentType = photo.mimetype;
                } catch (readError) {
                    console.error('Error reading the file:', readError);
                    return res.status(400).json({
                        error: 'Failed to read the image file'
                    });
                }
            } else {
                return res.status(400).json({
                    error: 'Invalid file path'
                });
            }
        }

        // Validate the product data
        const validationErrors = product.validateSync();
        if (validationErrors) {
            return res.status(400).json({
                error: 'Validation error',
                details: validationErrors.errors
            });
        }
        product.save()
        .then(result => {
           res.json(result);
        })
        .catch(err => {
           console.error("Error saving product: ", err);
           res.status(400).json({
               error: errorHandler(err)
           });
        });
        });
        };
        exports.remove = async (req, res) => {
            try {
                let product = req.product;
                const deletedProduct = await product.deleteOne();
                res.json({
                    deletedProduct,
                    message: "Product Deleted Successfully"
                });
            } catch (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
        };
        

        
        exports.update = (req, res) => {
            let form = new formidable.IncomingForm();
            form.keepExtensions = true;
            form.parse(req, (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Image couldn\'t be uploaded'
                    });
                }
        
                // Convert form fields to correct types
                fields.name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
                fields.description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
                fields.price = Array.isArray(fields.price) ? parseFloat(fields.price[0]) : parseFloat(fields.price);
                fields.quantity = Array.isArray(fields.quantity) ? parseInt(fields.quantity[0], 10) : parseInt(fields.quantity, 10);
                fields.shipping = Array.isArray(fields.shipping) ? (fields.shipping[0] === 'true') : (fields.shipping === 'true');
        
                let product = req.product;
                product= _.extend(product,fields); //lodash extension used--> two extensions taken
        
                if (files.photo && Array.isArray(files.photo) && files.photo.length > 0) {
             
                    let photo = files.photo[0]; // Access the first element of the array
                    if (typeof photo.filepath === 'string' && fs.existsSync(photo.filepath)) {
                        try {
                            product.photo.data = fs.readFileSync(photo.filepath);
                            product.photo.contentType = photo.mimetype;
                        } catch (readError) {
                            console.error('Error reading the file:', readError);
                            return res.status(400).json({
                                error: 'Failed to read the image file'
                            });
                        }
                    } else {
                        return res.status(400).json({
                            error: 'Invalid file path'
                        });
                    }
                }
        
                // Validate the product data
                const validationErrors = product.validateSync();
                if (validationErrors) {
                    return res.status(400).json({
                        error: 'Validation error',
                        details: validationErrors.errors
                    });
                }
                product.save()
                .then(result => {
                   res.json(result);
                })
                .catch(err => {
                   console.error("Error saving product: ", err);
                   res.status(400).json({
                       error: errorHandler(err)
                   });
                });
                });
                };


                //sell and arrival 
                 /* 
                 CONDITIONS:

                 by sell= /products?sortBy=sold&order=desc&limit=4
                  by arrival= /products?sortBy=createdAt&order=desc&limit=4
                  
                  here,desc is descending order and asc is ascending order
                  if no params are sent,then all products are returned.
                 */
          
                  
        // exports.list=(req,res) =>{
        //     let order= req.query.order? req.query.order: 'asc'
        //     let sortBy= req.query.sortBy? req.query.sortBy: '_id'
        //     let limit= req.query.limit? req.query.limit: 6 //value by default

        //     Product.find()
        //     .select("-photo")
        //     .populate('category')
        //     .sort([[sortBy,order]])
        //     .limit(limit)
        //     .exec((err,products)=>{
        //         if(err){
        //             return res.status(400).json({
        //                 error:'Products Not found'
        //             });
        //         }
        //         res.send(products);
        //     });
        // };

        exports.list = async (req, res) => {
            let order = req.query.order ? req.query.order : 'asc';
            let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
            let limit = req.query.limit ? parseInt(req.query.limit) : 6; // default value
        
            try {
                const products = await Product.find()
                    .select("-photo")
                    .populate('category')
                    .sort([[sortBy, order]])
                    .limit(limit);
        
                res.send(products);
            } catch (err) {
                res.status(400).json({
                    error: 'Products Not found'
                });
            }
        };
        


        /* it will find the products based on the req product category 
            other products that has the same category will be returned.
        */
       exports.listRelated = (req, res) => {
           let limit = req.query.limit ? parseInt(req.query.limit) : 6;
           
           Product.find({ _id: { $ne: req.product }, category: req.product.category })
           .limit(limit)
           .populate('category', '_id name')
           .then(products => {
               res.json(products);
            })
            .catch(err => {
                res.status(400).json({
                    error: "Products not found"
                });
            });
        };
        // exports.listRelated= (req,res) => {
        //     let limit= req.query.limit? parseInt(req.query.limit): 6;
        //     Product.find({_id: {$ne: req.product},category: req.product.category})
        //     .limit(limit)
        //     .populate('category','_id name')
        //     .exec((err,products)=>{
        //         if(err){
        //             return res.status(400).json({
        //                 error:"Products Not found"
        //             });
        //         };
        //     });
        // };

    


        /**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
        
        exports.listBySearch = async (req, res) => {
            let order = req.body.order ? req.body.order : "desc";
            let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
            let limit = req.body.limit ? parseInt(req.body.limit) : 100;
            let skip = parseInt(req.body.skip);
            let findArgs = {};
            // console.log(order, sortBy, limit, skip, req.body.filters);
            // console.log("findArgs", findArgs);
            
            for (let key in req.body.filters) {
                if (req.body.filters[key].length > 0) {
                    if (key === "price") {
                        findArgs[key] = {
                            $gte: req.body.filters[key][0], 
                            $lte: req.body.filters[key][1]
                            // gte -  greater than price [0-10] keys in 
                            // lte - less than
                        };
                    } else {
                        findArgs[key] = req.body.filters[key];
                    }
                }
            }
        
            try {
                const products = await Product.find(findArgs)
                    .select("-photo")
                    .populate("category")
                    .sort([[sortBy, order]])
                    .skip(skip)
                    .limit(limit)
                    .exec();
        
                res.json({
                    size: products.length,
                    data: products
                });
            } catch (err) {
                res.status(400).json({
                    error: "Products not found"
                });
            }
        };

        exports.photo = (req,res,next)=>{
            if(req.product.photo.data){
                res.set('Content-Type',req.product.photo.contentType)
                return res.send(req.product.photo.data)
            }
            next();
        }
        