const mongoose = require('mongoose');
const Review = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        name: {
            type: String,
            require: true,
        },
        avatar: [],
        star: {
            type: Number,
            require: true,
        },
        comment: {
            type: String,
            require: true,
            trim: true,
        },
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

module.exports = mongoose.model('Review', Review);
