require('dotenv').config();
const { Client } = require('pg');

// Connect to default postgres database
const defaultClient = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: process.env.PASSWORD,
  database: "postgres"
});

let productClient; 

async function initDatabase() {
  try {
    await defaultClient.connect();

    const dbName = "product_catalog";

    // Check if database exists
    const res = await defaultClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      await defaultClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }

    await defaultClient.end();

    // Now connect to your actual database
    productClient = new Client({
      host: "localhost",
      user: "postgres",
      port: 5432,
      password: process.env.PASSWORD,
      database: dbName
    });

    await productClient.connect();
    console.log(`Connected to database "${dbName}"`);
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}

// Export both function and client reference
module.exports = { initDatabase, getClient: () => productClient };
