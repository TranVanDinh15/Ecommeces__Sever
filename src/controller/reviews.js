const modelReviews = require('../models/Reviews');
const modelUser = require('../models/user');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const { query } = require('express');
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
class ReviewController {
    createReview(req, res) {
        return new Promise(async (resolve, reject) => {
            try {
                const getUser = await modelUser
                    .find({
                        _id: req.user._id,
                    })
                    .select('userName');
                console.log(getUser[0].userName);
                if (req.body) {
                    let productPicture = [];
                    console.log(req.files);
                    if (req.files.length > 0) {
                        for (let file of req.files) {
                            const result = await uploadImage(file.path);
                            productPicture.push(result);
                        }
                    }
                    const { productId, star, comment } = req.body;
                    const createReview = new modelReviews({
                        userId: req.user._id,
                        productId: productId,
                        name: getUser[0].userName,
                        star: star,
                        comment: comment,
                        avatar: productPicture,
                    });
                    createReview.save((error, review) => {
                        if (error) {
                            resolve(res.status(500).json('error from server'));
                        }
                        if (review) {
                            resolve(
                                res.status(200).json({
                                    review,
                                    message: 'create Review Success !!',
                                }),
                            );
                        }
                    });
                } else {
                    resolve(res.status(500).json('request not received'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    getReviewByProductId(req, res) {
        return new Promise(async (resolve, reject) => {
            try {
                const { productId } = req.params;
                console.log(productId);
                const { userId } = req.body;
                console.log(userId);
                let user = [];
                if (productId) {
                    if (userId) {
                        const reviewUserId = await modelReviews.find({
                            userId: userId,
                        });
                        if (reviewUserId) {
                            user.push(...reviewUserId);
                        }
                        const reviewProductId = await modelReviews
                            .find({
                                productId: productId,
                            })
                            .sort({ _id: -1 });
                        if (reviewProductId) {
                            resolve(
                                res.status(200).json({
                                    user,
                                    reviewProductId,
                                }),
                            );
                        }
                    } else {
                        const reviewProductId = await modelReviews.find({
                            productId: productId,
                        });
                        resolve(
                            res.status(200).json({
                                reviewProductId,
                            }),
                        );
                    }
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
module.exports = new ReviewController();
