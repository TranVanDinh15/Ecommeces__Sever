const express = require('express');
const router = express.Router();
const reviewController = require('../controller/reviews');
const { validateRequest, isValidatorsSignUp } = require('../validators/validators');
const middleware = require('../common-middleware/index');
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
router.post('/createReview', middleware.requireSignin, upload.array('avatar'), reviewController.createReview);
router.post('/getReviewByProductId/:productId', reviewController.getReviewByProductId);

module.exports = router;
