<<<<<<< HEAD
import "dotenv/config";
import mysql from "mysql2/promise";

const conexion = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "sistema_usuarios",
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

=======
// ---------------------------
// CONEXIÓN A LA BASE DE DATOS
// ---------------------------

// Importa la librería mysql2
import mysql from "mysql2/promise";

// Importa dotenv
import dotenv from "dotenv";

// Carga las variables del archivo .env
dotenv.config();

// Crea la conexión con MySQL
const conexion = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Mensaje de confirmación
console.log("✅ Conectado correctamente a MySQL");

>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600
export default conexion;