const modelPage = require('../models/page');
// const modelsCategory = require('../models/category');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const { query } = require('express');
const cloudinary = require('cloudinary').v2;

// const uploadImage = (fileUpload) => {
//     return new Promise(async (resolve, reject) => {
//         let picture = await cloudinary.uploader.upload(fileUpload, (error, result) => {
//             resolve({
//                 url: result.secure_url,
//                 asset_id: result.asset_id,
//                 public_id: result.public_id,
//             });
//         });
//     });
// };
class PageController {
    createPage(req, res){
        return new Promise( async (resolve, reject)=>{
            const {banners, product}=req.files
            if(banners.length>0){
                
            }
        })
    }
}
module.exports = new PageController();
