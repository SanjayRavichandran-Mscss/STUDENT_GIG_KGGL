import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "san@123",
  database: process.env.DB_NAME || "studentgig",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test db connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection error:", err.message);
    return;
  }
  console.log("Database connected successfully");
  connection.release(); // Release the connection back to the db
});

export default db;