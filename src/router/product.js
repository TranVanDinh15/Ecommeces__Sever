const express = require('express');
const router = express.Router();
const productController = require('../controller/product');
const userController = require('../controller/auth_user');
const middleware = require('../common-middleware/index');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'));
    },
    filename: function (req, file, cb) {
        //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, shortid.generate() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });
router.post(
    '/product/create',
    middleware.requireSignin,
    middleware.adminMiddleware,
    upload.array('productPicture'),
    productController.createProduct,
);
router.get('/product/getProduct', productController.getProduct);
router.get('/product/:_id', productController.getProductByID);
router.post('/product/upload', upload.array('productPicture'), productController.uploadFile);
module.exports = router;
