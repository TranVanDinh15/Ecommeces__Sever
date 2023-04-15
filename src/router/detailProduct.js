const express = require('express');
const router = express.Router();
const detaiProductController = require('../controller/detailProduct');
const { validateRequest, isValidatorsSignUp } = require('../validators/validators');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + '-' + file.originalname);
    },
});
const upload = multer({ storage: storage });
router.post(
    '/detailProduct/create',
    upload.array('productPicture'),
    validateRequest,
    isValidatorsSignUp,
    detaiProductController.createDetailProduct,
);
router.get('/getDetailProductItem', detaiProductController.getDetailProductItem);
module.exports = router;
