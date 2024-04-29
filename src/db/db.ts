import dotenv from "dotenv";
import mysql from "mysql2/promise"; // Get the Client.

dotenv.config();

// Create the connection pool. The pool-specific settings are the defaults.
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
