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