const jwt = require('jsonwebtoken');
exports.requireSignin = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const user = jwt.verify(token, process.env.ECOMMECE_SCRET);
        req.user = user;
        console.log(token);
        console.log(user);
    } else {
        return res.status(400).json({
            message: 'Authorization require',
        });
    }
    next();
};
exports.adminMiddleware = (req, res, next) => {
    if (req.user.role != 'admin') {
        console.log(req.user.role);
        return res.status(202).json({
            message: 'Access denied',
        });
    }
    next();
};
exports.userMiddleware = (req, res, next) => {
    if (req.user.role != 'user') {
        console.log(req.user.role);
        return res.status(202).json({
            message: 'Access denied',
        });
    }
    next();
};
