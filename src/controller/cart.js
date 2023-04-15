const modelsCart = require('../models/cart');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const product = require('./product');
class cartController {
    addCart(req, res) {
        modelsCart
            .findOne({
                user: req.user._id,
            })
            .exec((error, cart) => {
                if (error) {
                    if (error) {
                        return res.status(400).json({
                            error,
                        });
                    }
                }
                if (cart) {
                    // Nếu cart tồn tại thì cập nhật lại quantity
                    const isProduct = cart.cartItem.find((item) => {
                        return item.product == req.body.cartItem.product;
                    });
                    if (isProduct) {
                        console.log(isProduct);
                        const product = req.body.cartItem.product;
                        modelsCart
                            .findOneAndUpdate(
                                { user: req.user._id, 'cartItem.product': product },
                                {
                                    $set: {
                                        'cartItem.$': {
                                            ...req.body.cartItem,
                                            quantity: isProduct.quantity + req.body.cartItem.quantity,
                                        },
                                    },
                                },
                            )
                            .exec((error, _cart) => {
                                if (error) {
                                    if (error) {
                                        return res.status(400).json({
                                            message: error,
                                        });
                                    }
                                }
                                if (_cart) {
                                    return res.status(200).json({
                                        _cart,
                                    });
                                }
                            });
                    } else {
                        modelsCart
                            .findOneAndUpdate(
                                { user: req.user._id },
                                {
                                    $push: {
                                        cartItem: req.body.cartItem,
                                    },
                                },
                            )
                            .exec((error, _cart) => {
                                if (error) {
                                    if (error) {
                                        return res.status(400).json({
                                            message: error,
                                        });
                                    }
                                }
                                if (_cart) {
                                    return res.status(200).json({
                                        _cart,
                                    });
                                }
                            });
                    }
                } else {
                    // Nếu cart không tồn tại thì thêm cart mới
                    const cart = new modelsCart({
                        user: req.user._id,
                        cartItem: [req.body.cartItem],
                    });
                    cart.save((error, cart) => {
                        if (error) {
                            return res.status(400).json({
                                error,
                            });
                        }
                        if (cart) {
                            return res.status(200).json({
                                cart,
                            });
                        }
                    });
                }
            });
    }
}
module.exports = new cartController();
