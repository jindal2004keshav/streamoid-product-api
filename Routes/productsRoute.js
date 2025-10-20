const express = require("express");
const {handleUploadProducts, handleGetProducts} = require("../Controller/productController");
const upload = require("../Middleware/multerConfig");


const productRoute = express.Router();

productRoute.post("/upload", upload.single('file'), handleUploadProducts);

productRoute.get("/", handleGetProducts)

module.exports = productRoute;