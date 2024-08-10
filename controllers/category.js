const Category = require("../models/category");
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = async (req, res, next, id) => {
    try {
        const category = await Category.findById(id).exec();
        if (!category) {
            return res.status(400).json({
                error: 'Category does not exist.'
            });
        }
        req.category = category;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Something went wrong while fetching the category.'
        });
    }
};


exports.create = async (req, res) => {
    const category = new Category(req.body);
    try {
        const data = await category.save();
        res.json({ data });
    } catch (err) {
        res.status(400).json({
            error: errorHandler(err)
        });
    }
};

exports.read= (req,res)=>{
    return res.json(req.category);
}
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

exports.update = async (req, res) => {
    try {
        const category = req.category;
        category.name = req.body.name;

        const data = await category.save();

        res.json(data);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};
// exports.update= (req,res) =>{
//     const category=req.category;
//     category.name=req.body.name;
//     category.save((err,data)=>{
//         if(err){
//             return res.status(400).json({
//                 error:errorHandler(err)
//             });
//         }
//         res.json(data)
//     });
// };

exports.remove = async (req, res) => {
    try {
        const category = req.category;

        if (!category) {
            return res.status(400).json({ error: "Category not found" });
        }

        await Category.deleteOne({ _id: category._id }); //deleteOne==> remove 
        //remove is a function used at routes and remove is not supported on newer versions of MOngo

        res.json({ message: 'Category Deleted' });
    } catch (err) {
        console.error("Error occurred while deleting the category:", err);
        return res.status(400).json({ error: errorHandler(err) });
    }
};


// exports.remove = async (req, res) => {
//     try {
//         const category = req.category;
//         await category.remove();

//         res.json({
//             message: 'Category Deleted'
//         });
//     } catch (err) {
//         return res.status(400).json({
//             error: errorHandler(err)
//         });
//     }
// };
// exports.remove= (req,res) =>{
//     const category=req.category;
    
//     category.remove((err,data)=>{
//         if(err){
//             return res.status(400).json({
//                 error:errorHandler(err)
//             });
//         }
//         res.json({
//             message: 'Category Deleted'
//         });
//     });
// };
// Remove callback


exports.list = async (req, res) => {
    try {
        const data = await Category.find().exec();
        res.json(data);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};
