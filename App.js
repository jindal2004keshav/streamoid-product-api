const {initDatabase} = require("./Connect");
const express = require("express");
const HttpError = require("./Model/http-error");
const productRoute = require("./Routes/productsRoute");

initDatabase();

const app = express();

app.use("/api/product", productRoute);

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    const status = typeof error.code === 'number' ? error.code : 500;
    res.status(status || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Server is started at ${url}`);
});