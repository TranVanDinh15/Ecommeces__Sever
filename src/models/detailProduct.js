const mongoose = require('mongoose');
const DetailProduct = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true,
        },

        description: {
            type: String,
            require: true,
            trim: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            require: true,
        },
        productPicture: [],
        createBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        createdAt: Date,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('DetailProduct', DetailProduct);
