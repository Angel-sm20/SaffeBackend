// IMPORTACIÓN DE LIBRERÍAS

// Importa Express para crear el servidor
import express from "express";

// Importa CORS para permitir la comunicación con el frontend
import cors from "cors";

import "dotenv/config";

import "./app/config/database.js";

import routeUsuario from "./app/routes/routes.usuario.js";

import routeAuth from "./app/routes/routes.auth.js";

import routeAcceso from "./app/routes/routes.acceso.js";

import routeEscaneo from "./app/routes/routes.escaneo.js";

import routeHistorial from "./app/routes/routes.historial.js";

// --------------------------
// CONFIGURACIÓN DEL SERVIDOR
// -------------------------

// Crea la aplicación Express
const app = express();

// Puerto donde se ejecutará el backend
const PORT = Number(process.env.PORT || 3000);

// -----------
// MIDDLEWARES
// -----------

// Permite recibir información en formato JSON
app.use(express.json());

// Permite la comunicación entre frontend y backend
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:4000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/api", routeUsuario);

app.use("/api", routeAuth);

app.use("/api", routeAcceso);

app.use("/api", routeEscaneo);

app.use("/api", routeHistorial);

app.use(express.urlencoded({ extended: true }));

// ---------------
// RUTA DE PRUEBA
// ---------------

// Verifica que el servidor está funcionando
app.get("/", (req, res) => {
    res.json({
        mensaje: "Backend SAFFE funcionando correctamente"
    });
});

// -----------------
// INICIAR SERVIDOR
// -----------------

// Enciende el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});