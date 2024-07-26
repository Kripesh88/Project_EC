const Category = require("../models/category");
const { errorHandler } = require('../helpers/dbErrorHandler');

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
