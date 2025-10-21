# Streamoid-product-api

A simple **RESTful API** built with **Node.js**, **Express**, and **PostgreSQL** for managing product data.  
This API allows users to upload, retrieve, and filter product information efficiently.

## ⚙️ Project Setup & Initialization

### 1️. Clone the Repository
```bash
git clone https://github.com/jindal2004keshav/streamoid-product-api.git
cd streamoid-product-api
```

### 2. Install Dependencies
Ensure you have Node.js (v16+), npm, and PostgreSQL installed. Then install project
Then install all dependencies using:
```bash
npm install
```

### 3. Create the .env File
Create a file named .env in the project root and add your configuration:
```bash
PORT=8081
DB_USER=your_postgres_username
DB_HOST=localhost
DB_PASSWORD=your_password
```

### 4. Start the Server
```bash
npm start
```
You should see:
```bash
Server is started at http://localhost:8001
Database "product_catalog" created successfully.
Connected to database "product_catalog"
```

## 🧾 API Documentation

### 🔹 Base URL
```bash
http://localhost:8081
```

### 1. POST /api/products/upload
Description: Add new products using a csv file and provide SKU of products with invalid input
Format for csv:
```bash
sku, name, brand, color, size, mrp, price, quantity
TSHIRT-RED-001,Classic Cotton T-Shirt,StreamThreads,Red,M,799,499,20
TSHIRT-BLK-002,Classic Cotton T-Shirt,StreamThreads,Black,L,799,549,12
POLO-GRN-003,Heritage Polo,StreamThreads,Green,,1299,999,8
```

Request Type: multipart/form-data
Field Name: file

Example (Postman / cURL):
```bash
curl -X POST -F "file=@products.csv" http://localhost:8081/api/product/upload
```
Response:
```bash
{
    "message": "CSV processed successfully",
    "total": 17,
    "success": 15,
    "failed": 2,
    "errors": [
        {
            "sku": "POLO-GRN-003",
            "error": "Invalid input format"
        },
        {
            "sku": "KURTA-BLU-M",
            "error": "Invalid input format"
        }
    ]
}
```

### 2. GET /api/products
Description: Retrieve all products with page and limit in query. Also validates for correct page and limit
<br>
Query Parameters:
- `page` – Page number
- `limit` – Number of products per page
Response:
```bash
{
    "page": 2,
    "limit": 2,
    "products": [
        {
            "id": 3,
            "sku": "POLO-GRN-003",
            "name": "Heritage Polo",
            "brand": "StreamThreads",
            "color": "Green",
            "size": "XL",
            "mrp": "1299.00",
            "price": "999.00",
            "quantity": 8
        },
        {
            "id": 4,
            "sku": "JEANS-BLU-032",
            "name": "Slim Fit Jeans",
            "brand": "DenimWorks",
            "color": "Blue",
            "size": "32",
            "mrp": "1999.00",
            "price": "1599.00",
            "quantity": 15
        }
    ]
}
```

### 3. GET /api/products/search
Description: Retrieve products with optional filters: brand, color, minPrice, maxPrice. Filters are applied dynamically.
Response:
```bash
{
    "count": 1,
    "filters": {
        "brand": "StreamThreads",
        "color": "Red"
    },
    "products": [
        {
            "id": 1,
            "sku": "TSHIRT-RED-001",
            "name": "Classic Cotton T-Shirt",
            "brand": "StreamThreads",
            "color": "Red",
            "size": "M",
            "mrp": "799.00",
            "price": "499.00",
            "quantity": 20
        }
    ]
}
```

## 🧰 Tech Stack
- Node.js
- Express
- PostgreSQL
- Multer
- dotenv
- Nodemon

##  🧪 Testing the API
You can test endpoints using:
- `Postman` 
- `cURL` 

### 1. Test Add Products
A csv is added in the repo for testing
Input:
```bash
curl -X POST -F "file=@products.csv" http://localhost:8081/api/product/upload
```
Output should be:
```bash
{
    "message": "CSV processed successfully",
    "total": 17,
    "success": 15,
    "failed": 2,
    "errors": [
        {
            "sku": "POLO-GRN-003",
            "error": "Invalid input format"
        },
        {
            "sku": "KURTA-BLU-M",
            "error": "Invalid input format"
        }
    ]
}
```

### 2. Test Retrive All Products
Set the Page and Limit in the Params of query
Input:
```bash
curl -X POST -F "file=@products.csv" http://localhost:8081/api/product?page=2&limit=2
```
Output:
```bash
{
    "page": 2,
    "limit": 2,
    "products": [
        {
            "id": 3,
            "sku": "POLO-GRN-003",
            "name": "Heritage Polo",
            "brand": "StreamThreads",
            "color": "Green",
            "size": "XL",
            "mrp": "1299.00",
            "price": "999.00",
            "quantity": 8
        },
        {
            "id": 4,
            "sku": "JEANS-BLU-032",
            "name": "Slim Fit Jeans",
            "brand": "DenimWorks",
            "color": "Blue",
            "size": "32",
            "mrp": "1999.00",
            "price": "1599.00",
            "quantity": 15
        }
    ]
}
```

### 3. Test Retrive Products using Filters
Set the brand, color, minPrice and maxPrice in the Params of query. I will dynamically add the filters when they are provided
Input:
```bash
curl -X POST -F "file=@products.csv" http://localhost:8001/api/product/search?color=Black&brand=StreamThreads&minPrice=500&maxPrice=800
```
Output:
```bash
{
    "count": 1,
    "filters": {
        "brand": "StreamThreads",
        "color": "Black",
        "minPrice": "500",
        "maxPrice": "800"
    },
    "products": [
        {
            "id": 2,
            "sku": "TSHIRT-BLK-002",
            "name": "Classic Cotton T-Shirt",
            "brand": "StreamThreads",
            "color": "Black",
            "size": "L",
            "mrp": "799.00",
            "price": "549.00",
            "quantity": 12
        }
    ]
}
```



