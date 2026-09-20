import "dotenv/config";
import express from "express";
import cors from "cors";

import "./app/config/database.js";
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
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
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

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
