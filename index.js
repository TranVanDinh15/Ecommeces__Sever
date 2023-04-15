const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./src/router/user');
const adminRouter = require('./src/router/admin/userAdmin');
const category = require('./src/router/category');
const product = require('./src/router/product');
const detailProduct = require('./src/router/detailProduct');
const reviews = require('./src/router/Reviews');
const cart = require('./src/router/cart');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const { createClient } = require('redis');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

let redisClient = createClient({ legacyMode: true });
// var methodOverride = require('method-override');
redisClient.connect().catch(console.error);
let RedisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use('/public', express.static(path.join(__dirname, '/src/uploads')));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100000, limit: '500mb' }));
app.use(bodyParser.json());
require('dotenv').config();
mongoose
    .connect(
        `mongodb+srv://${process.env.MONGOOSE_DB_USERNAME}:${process.env.MONGOOSE_DB_PASSWORD}@cluster0.nk5acyh.mongodb.net/?retryWrites=true&w=majority`,
        {},
    )
    .then(() => {
        console.log('connect database');
    });
app.use('/api', userRouter);
app.use('/api', category);
app.use('/api', product);
app.use('/api', cart);
app.use('/api', adminRouter);
app.use('/api', detailProduct);
app.use('/api', reviews);
app.get('/', (req, res) => {
    return res.send('hello');
});

app.use(
    fileUpload({
        useTempFiles: true,
    }),
);
// Configuration
cloudinary.config({
    cloud_name: 'dqwzzgavd',
    api_key: '527248261528922',
    api_secret: 'H5EE9qM0dvgr4b9VXzN-PK-cBL4',
});
// app.use(bodyParser({ uploadDir: path.join(__dirname, 'files'), keepExtensions: true }));
// app.use(methodOverride());
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});
