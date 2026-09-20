import "dotenv/config";
import mysql from "mysql2/promise";

const conexion = mysql.createPool({
    host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
    user: process.env.DB_USER || process.env.MYSQLUSER || "root",
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "root",
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || "sistema_usuarios",
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default conexion;
