const express = require("express");
const {handleUploadProducts, handleGetProducts, handleSearchProducts} = require("../Controller/productController");
const upload = require("../Middleware/multerConfig");


const productRoute = express.Router();

productRoute.post("/upload", upload.single('file'), handleUploadProducts);

productRoute.get("/", handleGetProducts);

productRoute.get("/search", handleSearchProducts)

module.exports = productRoute;