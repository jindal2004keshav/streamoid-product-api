const fs = require("fs");
const csv = require("csv-parser");
const { getClient } = require("../Connect"); // use getClient from your connect.js
const HttpError = require("../Model/http-error");

// Validation function for the entries
function isValidProduct(p) {
  if (!p.sku || !p.name || !p.brand || !p.color || !p.size) return false;
  if (!p.mrp || !p.price || !p.quantity) return false;
  if (Number(p.price) > Number(p.mrp)) return false;
  if (Number(p.quantity) <= 0) return false;
  return true;
}

async function handleUploadProducts(req, res, next) {
  if (!req.file) return next(new HttpError("CSV file is required", 400));

  const filePath = req.file.path;
  const rows = [];
  const errors = [];
  const validProducts = [];
  const con = getClient();

  try {
    // Read CSV into rows[]
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    // Validate and collect valid products
    for (const product of rows) {
      const cleaned = {};
      for (const key in product) {
        cleaned[key.trim().replace(/^\uFEFF/, "")] = product[key]?.trim();
      }

      if (isValidProduct(cleaned)) {
        validProducts.push({
          ...cleaned,
          mrp: Number(cleaned.mrp),
          price: Number(cleaned.price),
          quantity: Number(cleaned.quantity),
        });
      } else {        
        errors.push({ sku: cleaned.sku, error: "Invalid input format" });
      }
    }

    // Create table if not exists
    await con.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        sku VARCHAR(100) UNIQUE,
        name VARCHAR(255),
        brand VARCHAR(255),
        color VARCHAR(50),
        size VARCHAR(50),
        mrp NUMERIC(10,2),
        price NUMERIC(10,2),
        quantity INT
      )
    `);

    // Insert valid products
    if (validProducts.length) {
      const placeholders = validProducts
        .map(
          (_, i) =>
            `($${i * 8 + 1}, $${i * 8 + 2}, $${i * 8 + 3}, $${i * 8 + 4}, $${i * 8 + 5}, $${i * 8 + 6}, $${i * 8 + 7}, $${i * 8 + 8})`
        )
        .join(",");

      const values = validProducts.flatMap((p) => [
        p.sku,
        p.name,
        p.brand,
        p.color,
        p.size,
        p.mrp,
        p.price,
        p.quantity,
      ]);

      await con.query(
        `INSERT INTO products (sku, name, brand, color, size, mrp, price, quantity)
         VALUES ${placeholders}
         ON CONFLICT (sku) DO NOTHING`,
        values
      );
    }

    // Step 5: Cleanup and respond
    fs.unlink(filePath, () => {});
    res.status(200).json({
      message: "CSV processed successfully",
      total: rows.length,
      success: validProducts.length,
      failed: errors.length,
      errors,
    });
  } catch (err) {
    console.error("CSV processing error:", err);
    fs.unlink(filePath, () => {});
    next(new HttpError("Error while processing CSV", 500));
  }
}

async function handleGetProducts(req, res, next){
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const con = getClient();

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        return next(new HttpError("Invalid page or limit", 400));
    }

    const offset = (page-1)*limit;

    try{
        const productsRes = await con.query(
          `SELECT * FROM products LIMIT $1 OFFSET $2`,
          [limit, offset]
        );
        res.status(200).json({
            page,
            limit,
            products: productsRes.rows
        });
    } catch(err){
        console.log(err);
        return next(new HttpError("Something went wrong while fetching products", 500));
    }
}

module.exports = { handleUploadProducts, handleGetProducts};
