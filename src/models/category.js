const mongoose = require('mongoose');
const category = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true,
        },
        slug: {
            type: String,
            require: true,
            unique: true,
        },
        categoryImage: {
            type: String,
        },
        type: {
            type: String,
        },
        parentId: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Category', category);
