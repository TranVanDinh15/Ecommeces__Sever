const modelsProduct = require('../models/product');
const modelsCategory = require('../models/category');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const { query } = require('express');
const cloudinary = require('cloudinary').v2;
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
            categoryImage: cate.categoryImage,
            children: createCategories(categories, cate._id),
        });
    }
    return categoriesList;
};
const uploadImage = (fileUpload) => {
    return new Promise(async (resolve, reject) => {
        let picture = await cloudinary.uploader.upload(fileUpload, (error, result) => {
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id,
            });
        });
    });
};
class productController {
    async createProduct(req, res) {
        const { name, price, description, category, createBy, quantity } = req.body;
        let productPicture = [];
        console.log(req.files);
        if (req.files.length > 0) {
            for (let file of req.files) {
                const result = await uploadImage(file.path);
                productPicture.push(result);
                console.log(result);
            }
        }
        console.log(productPicture);
        const product = new modelsProduct({
            name,
            slug: slugify(name),
            price,
            description,
            category,
            quantity,
            productPicture,
            createBy: req.user._id,
        });
        product.save((error, product) => {
            if (error) {
                return res.status(400).json({
                    error,
                });
            }
            if (product) {
                return res.status(200).json({
                    product,
                });
            }
        });
    }
    async getProduct(req, res) {
        // const page = req.query.page;
        // const PAGE_SIZE = 2;
        // const skip = (page - 1) * PAGE_SIZE;
        // const countPage = await modelsProduct.countDocuments();
        const categories = await modelsCategory.find({}).exec();
        const product = await modelsProduct
            .find({})
            // .skip(skip)
            // .limit(PAGE_SIZE)
            .select('_id name price quantity slug description productPicture category')
            .populate({ path: 'category', select: '_id name' })
            .exec((error, product) => {
                if (error) {
                    return res.status(500).json(error);
                }
                if (product) {
                    return res.status(200).json({
                        categories: createCategories(categories),
                        product: product,
                    });
                }
            });
    }
    async getProductByID(req, res) {
        const { _id } = req.params;
        const page = req.query.page;
        console.log(page);
        const PAGE_SIZE = 4;
        const skip = (page - 1) * PAGE_SIZE;
        const countPage = await modelsProduct.countDocuments();
        const product = await modelsProduct
            .find({
                category: _id,
            })
            .select('_id name price quantity slug description productPicture category')
            .populate({ path: 'category', select: '_id name' })
            .sort({ _id: -1 })
            .exec((error, product) => {
                if (error) {
                    return res.status(400).json({
                        error,
                    });
                }
                if (product) {
                    return res.status(200).json({
                        product,
                        productByPrice: [
                            {
                                name: 'Dưới 1 triệu',
                                product: product.filter((item) => item.price < 1000000),
                            },

                            {
                                name: 'Từ 1 đến 5 triệu',
                                product: product.filter((item) => item.price > 1000000 && item.price <= 5000000),
                            },

                            {
                                name: 'Từ 5 đến 10 triệu',
                                product: product.filter((item) => item.price > 1000000 && item.price <= 10000000),
                            },

                            {
                                name: 'Từ 10 đến 20 triệu',
                                product: product.filter((item) => item.price > 10000000 && item.price <= 20000000),
                            },
                            {
                                name: 'Từ 20 đến 30 triệu',
                                product: product.filter((item) => item.price > 20000000 && item.price <= 30000000),
                            },
                            {
                                name: 'Trên 30 triệu',
                                product: product.filter((item) => item.price > 30000000),
                            },
                        ],
                        countPage: countPage,
                    });
                }
            });
    }
    async uploadFile(req, res) {
        const file = req.files;
        console.log(file[0].path);
        cloudinary.uploader.upload(file[0].path, (error, result) => {
            console.log(result);
        });
    }
}
module.exports = new productController();
