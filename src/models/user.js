const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userScheme = new mongoose.Schema(
    {
        fisrtName: {
            type: String,
            require: true,
            min: 3,
            max: 20,
        },
        lastName: {
            type: String,
            require: true,
            min: 3,
            max: 20,
        },
        userName: {
            type: String,
            require: true,
            trim: true,
            unique: true,
            index: true,
            lowercase: true,
        },
        email: {
            type: String,
            require: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            require: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'admin',
        },
        contact_number: {
            type: String,
        },
        profilePicture: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);
// userScheme.virtual('password').set(function (password) {
//     this.hash_password = bcrypt.hash(password, saltRounds, function (err, hash) {
//         // Store hash in your password DB.
//     });
// });
// userScheme.methods = {
//     authenticate: (password) => {
//         return bcrypt.compareSync(password, this.hash_password); // true;
//     },
// };
userScheme.virtual('fullName').get(function () {
    return `${this.fisrtName} ${this.lastName}`;
});
module.exports = mongoose.model('User', userScheme);
