const express = require("express");
const {handleUploadProducts} = require("../Controller/productController");
const upload = require("../Middleware/multerConfig");


const productRoute = express.Router();

productRoute.post("/upload", upload.single('file'), handleUploadProducts);

module.exports = productRoute;