import "./app/config/env.js";
import express from "express";
import cors from "cors";

import conexion from "./app/config/database.js";
import { migrarBaseDeDatos } from "./app/config/migrate.js";
import { normalizarOrigen } from "./app/config/origin.js";
import routeUsuario from "./app/routes/routes.usuario.js";
import routeAuth from "./app/routes/routes.auth.js";
import routeAcceso from "./app/routes/routes.acceso.js";
import routeEscaneo from "./app/routes/routes.escaneo.js";
import routeHistorial from "./app/routes/routes.historial.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const allowedOrigins = (process.env.FRONTEND_ORIGIN ||
    "http://localhost:4000,https://saffefrontend.up.railway.app")
    .split(",")
    .map(normalizarOrigen)
    .filter(Boolean);

app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(normalizarOrigen(origin))) {
            return callback(null, true);
        }

        return callback(new Error("Origen no permitido por CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204
}));
app.use(express.urlencoded({ extended: true }));

app.use("/api", routeUsuario);
app.use("/api", routeAuth);
app.use("/api", routeAcceso);
app.use("/api", routeEscaneo);
app.use("/api", routeHistorial);

app.get("/", (req, res) => {
    res.json({ mensaje: "Backend SAFFE funcionando correctamente" });
});

app.get("/health", async (req, res) => {
    try {
        await conexion.query("SELECT 1");
        return res.json({ status: "ok", database: "connected" });
    } catch (error) {
        console.error("Health check could not connect to MySQL:", error.code || error.message);
        return res.status(503).json({ status: "error", database: "unavailable" });
    }
});

app.use((error, req, res, next) => {
    if (error.message === "Origen no permitido por CORS") {
        return res.status(403).json({ mensaje: error.message });
    }

    console.error("Error no controlado en la API:", error.message);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
});

const iniciarServidor = async () => {
    try {
        await migrarBaseDeDatos();
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en el puerto ${PORT}`);
        });
    } catch (error) {
        if (error.code === "ER_ACCESS_DENIED_ERROR") {
            console.error(
                "No se pudo conectar a MySQL: verifica DB_USER y DB_PASSWORD en backend/.env. " +
                "DB_PASSWORD es la contraseña de MySQL, no la de Gmail."
            );
        } else if (error.code === "ER_BAD_DB_ERROR") {
            console.error(
                "La base de datos configurada no existe. Verifica DB_NAME en backend/.env."
            );
        } else {
            console.error("No se pudo preparar la base de datos:", error.code || error.message);
        }
        await conexion.end();
        process.exit(1);
    }
};

iniciarServidor();
