const mongoose = require('mongoose');
const Page = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
            trim: true,
        },
        description: {
            type: String,
            require: true,
            trim: true,
        },
        banners: [
            {
                img: {
                    type: String,
                },
                navigateTo: {
                    type: String,
                },
            },
        ],
        product: [
            {
                img: {
                    type: String,
                },
                navigateTo: {
                    type: String,
                },
            },
        ],
        categories: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            require: true,
        },
        createBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Page', Page);
