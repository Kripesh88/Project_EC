const formidable=require('formidable');
const _ = require("lodash");
const fs=require('fs');
const path=require('path');
const Product = require("../models/product");
const { errorHandler }=require("../helpers/dbErrorHandler");
const { type } = require('os');



exports.create=(req,res)=>{
    const uploadDir = path.join(__dirname, '../uploads');

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    let form=new formidable.IncomingForm({
    keepExtensions:true,
    maxFileSize:10*1024*1024,
    multiples: true, // allow multiple files
    uploadDir: uploadDir // specify an upload directory //max size limit=10MB

    });
    // form.keepExtensions=true;
    // form.maxFileSize= 10*1024*1024;
    // multiples: true, // allow multiple files
    // uploadDir: 'path_to_temp_directory' // specify an upload directory //max size limit=10MB

    // const{name,description,price, category,quantity,shipping}=fields;
    // if(!name|| !description || !price || !category || !quantity ||!shipping){
    //     return res.status(400).json({
    //         error:"All the fields are required"
    //     });
    // };
    form.parse(req,(err,fields,files)=>{
        console.error("Formidable error: ",err);
        if(err){
            return res.status(400).json({
                error:"Image could not be uploaded"
            })
        }
        console.log("Fields:", fields);
        console.log("Files:", files);
        console.log("path: ",path);
     

        let product= new Product(fields);

        if(files.photo){
            
            console.log("FILES PHOTO:", files.photo);

            // Ensure the photo object is correctly accessed
            const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;
            
            
            if (!photo || !photo.path) {
                return res.status(400).json({
                    error: 'File path is missing. Please ensure the file is properly uploaded.'
                });
            }

            console.log('Photo object:', photo);
            console.log('Photo path:', photo.filepath);
            console.log('Photo type:', photo.mimetype);
            

            // console.log("Photo object:", photo); // Log photo object for debugging

            

            // // Add extra logging for photo object properties
            // console.log("Photo path:", photo.path);
            // console.log("Photo type:", photo.type);
           
                // if (!files.photo.path) {
                //     return res.status(400).json({
                //         error: "File path is missing. Please ensure the file is properly uploaded."
                //     });
                // }
            try{
            // product.photo.data= fs.readFileSync(files.photo.path);
            // product.photo.contentType=files.photo.type;
            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentype = files.photo.mimetype;
        }catch(readError){
            console.error("File system error: ", readError);
                return res.status(400).json({
                    error: "Image could not be uploaded"
                });
        }
    }

        product.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err) 
                });
            }
            res.json(result);
        });
    });
};










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
