const express = require('express');
const router = express.Router();
const modelCart = require('../models/cart');
const cartController = require('../controller/cart');
// const validators=require('../validators/validators')
const middleware = require('../common-middleware/index');
router.post('/cart/addCart', middleware.requireSignin, middleware.userMiddleware, cartController.addCart);
module.exports = router;
