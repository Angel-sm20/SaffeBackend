import "./env.js";
import mysql from "mysql2/promise";

const conexion = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST || "127.0.0.1",
    user: process.env.MYSQLUSER || process.env.DB_USER || "root",
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || "sistema_usuarios",
    port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default conexion;
