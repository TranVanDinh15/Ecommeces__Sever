const modelsCategory = require('../models/category');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const { findOneAndUpdate } = require('../models/category');
const createCategories = (categories, parentId = null) => {
    const categoriesList = [];
    let category;
    if (parentId == null) {
        category = categories.filter((item) => item.parentId == undefined);
    } else {
        category = categories.filter((item) => item.parentId == parentId);
    }
    for (let cate of category) {
        categoriesList.push({
            _id: cate.id,
            name: cate.name,
            slug: cate.name,
            parentId: cate.parentId,
            type: cate.type,
            categoryImage: cate.categoryImage,
            children: createCategories(categories, cate._id),
        });
    }
    return categoriesList;
};
class category {
    createCategory(req, res) {
        const category = {
            name: req.body.name,
            slug: slugify(req.body.name),
        };
        if (req.file) {
            category.categoryImage = req.file.filename;
        }
        if (req.body.parentId) {
            category.parentId = req.body.parentId;
        }
        const cat = new modelsCategory(category);
        cat.save((error, category) => {
            if (error) {
                return res.status(202).json({
                    error: error,
                });
            }
            if (category) {
                return res.status(201).json({
                    category,
                });
            }
        });
    }
    getCategory(req, res) {
        modelsCategory
            .find({})
            .select('_id name slug categoryImage parentId children type')
            .exec((error, categories) => {
                if (error) {
                    return res.status(202).json({
                        error,
                    });
                }
                if (categories) {
                    const categoriesList = createCategories(categories);
                    return res.status(200).json({
                        categoriesList,
                    });
                }
            });
    }
    async updateCategory(req, res) {
        const { _id, name, parentId, type } = req.body;
        const updateCategories = [];
        if (name instanceof Array) {
            for (let i = 0; i < name.length; i++) {
                const category = {
                    name: name[i],
                    type: type[i],
                };
                if (parentId != '') {
                    category.parentId = parentId[i];
                }
                const updateCategory = await modelsCategory.findOneAndUpdate({ _id: _id[i] }, category, { new: true });
                updateCategories.push(updateCategory);
            }
            return res.status(200).json({
                updateCategories,
            });
        } else {
            const category = {
                name: name,
                type: type,
            };
            if (parentId != '') {
                category.parentId = parentId;
            }
            const updateCategory = await modelsCategory.findOneAndUpdate({ _id: _id }, category, { new: true });
            return res.status(200).json({
                updateCategory,
            });
        }
    }
    async deleteCategory(req, res) {
        const { ids } = req.body.payLoad;
        const deleteCategories = [];
        for (let i = 0; i < ids.length; i++) {
            const deleteCategory = await modelsCategory.findOneAndDelete({ _id: ids[i]._id });
            deleteCategories.push(deleteCategory);
        }
        if (deleteCategories.length == ids.length) {
            return res.status(200).json({
                message: 'Remove Categories ',
            });
        } else {
            return res.status(400).json({
                message: 'Something went wrong ',
            });
        }
    }
}
module.exports = new category();
