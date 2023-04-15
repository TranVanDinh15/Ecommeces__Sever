const express = require('express');
const app = express();
const modelsUser = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const { transformArguments } = require('@redis/search/dist/commands/AGGREGATE');
const saltRounds = 10;
function accessToken(user) {
    return jwt.sign(
        {
            _id: user._id,
            role: user.role,
        },
        process.env.ECOMMECE_SCRET,
        // ,
        // {
        //     expiresIn: '30s',
        // },
    );
}
function refreshTokens(user) {
    return jwt.sign(
        {
            _id: user._id,
            role: user.role,
        },
        process.env.REFRESHTOKEN,
        // {
        //     expiresIn: '365d',
        // },
    );
}
class userController {
    async sigUpController(req, res) {
        modelsUser
            .findOne({
                email: req.body.email,
            })
            .exec((error, user) => {
                if (user) {
                    return res.status(201).json({
                        message: 'Email  already registered',
                    });
                }
                const { fisrtName, lastName, email, password, role } = req.body;
                const passwordHash = bcrypt.hashSync(password, saltRounds);
                console.log(passwordHash);
                const _user = new modelsUser({
                    fisrtName,
                    lastName,
                    email,
                    password: passwordHash,
                    role,
                    userName: shortid.generate(),
                });
                _user.save((error, data) => {
                    if (error) {
                        return res.status(201).json({
                            message: 'Something went wrong',
                        });
                    }
                    if (data) {
                        return res.status(200).json({
                            message: 'Create user success !!',
                            data,
                        });
                    }
                });
            });
    }
    async sigInController(req, res) {
        res.cookie('cookieName', 'cookieValue');
        console.log(req.cookies);
        modelsUser
            .findOne({
                email: req.body.email,
            })
            .exec(async (error, user) => {
                if (error) {
                    return res.status(500).json({
                        error,
                    });
                }
                if (user) {
                    if (!req.body.password || !user.password) {
                        return res.status(200).json({
                            message: 'Empty password',
                            user,
                        });
                    }
                    const compare = bcrypt.compareSync(req.body.password, user.password);
                    if (compare) {
                        const token = accessToken(user);
                        const refreshToken = refreshTokens(user);

                        const { fisrtName, lastName, role, fullName } = user;
                        return res.status(200).json({
                            token,
                            refreshToken,
                            user: {
                                fisrtName,
                                lastName,
                                role,
                                fullName,
                            },
                        });
                    } else {
                        return res.status(201).json({
                            message: 'Invalid Password',
                        });
                    }
                } else {
                    return res.status(201).json({
                        message: 'Email exist not in System !!',
                    });
                }
            });
    }
    async refreshToken(req, res) {
        const refreshTokenAccess = req.cookies.refreshToken;
        console.log(refreshTokenAccess);
        if (!refreshTokenAccess) return res.status(401).json('You are not authenticated');
        jwt.verify(refreshTokenAccess, process.env.REFRESHTOKEN, (err, user) => {
            if (err) {
                console.log(err);
            }
            const newAccessToken = accessToken(user);
            const newRefreshToken = refreshTokens(user);
            res.cookie('refreshToken', newRefreshToken, {
                // httpOnly: true,
                // secure: false,
                // path: '/',
                // sameSite: 'strict',
            });
            res.status(200).json({
                token: newAccessToken,
            });
        });
    }
}
module.exports = new userController();
