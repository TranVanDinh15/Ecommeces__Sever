const modelDetailProduct = require('../models/detailProduct');
const modelProduct = require('../models/product');
const cloudinary = require('cloudinary').v2;
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
class DetailProduct {
    async createDetailProduct(req, res) {
        return new Promise(async (resolve, reject) => {
            const arrayImage = [];
            const { name, description, productId } = req.body;
            // new modelDetailProduct
            if (req.files.length > 0) {
                for (let file of req.files) {
                    const result = await uploadImage(file.path);
                    arrayImage.push(result);
                }
            }
            const findDetail = modelDetailProduct.find({ productId: productId }).exec((error, result) => {
                if (error) {
                    return res.status(500).json(error);
                }

                if (result.length > 0) {
                    return res.status(201).json({
                        message: 'Detail Product is exist in system',
                    });
                } else {
                    const productDetail = new modelDetailProduct({
                        name,
                        description,
                        productId,
                        productPicture: arrayImage,
                    }).save((error, product) => {
                        if (error) {
                            return res.status(500).json(error);
                        }
                        if (product) {
                            return res.status(200).json(product);
                        }
                    });
                }
            });
        });
    }
    async getDetailProductItem(req, res) {
        const { id } = req.query;
        const productItem = await modelProduct
            .find({
                _id: id,
            })
            .select('price');
        // console.log(productItem);
        const getDetailProductItem = await modelDetailProduct.find({ productId: id }).exec((error, data) => {
            if (error) {
                return res.status(500).json('error from server');
            }
            if (data.length > 0) {
                if (productItem) {
                    let newData = [{ ...data[0]._doc, ...productItem[0]._doc }];
                    console.log(newData);
                    return res.status(200).json({
                        detailProduct: newData,
                    });
                }
                return res.status(200).json({
                    detailProduct: data,
                });
            }
            return res.status(200).json({
                detailProduct: data,
            });
        });
    }
}
module.exports = new DetailProduct();
