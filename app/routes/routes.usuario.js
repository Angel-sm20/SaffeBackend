// -------------------------
// IMPORTACIÓN DE LIBRERÍAS
// -------------------------

// Importa Router de Express
import { Router } from "express";

// Importación de controladores
import {
    listarUsuarios,
    crearUsuario,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerPerfil
} from "../controllers/controller.usuario.js";

// Middleware de autenticación
import { verificarToken } from "../middleware/auth.middleware.js";

// -------------------------
// CREAR ROUTER
// -------------------------

const router = Router();

// -------------------------
// RUTAS USUARIOS
// -------------------------

// Obtener perfil del usuario autenticado
router.get("/perfil", verificarToken, obtenerPerfil);
router.get("/usuarios", verificarToken, listarUsuarios);
router.post("/usuarios", crearUsuario);
router.get("/usuarios/:documento", verificarToken, obtenerUsuario);
router.put("/usuarios/:documento", verificarToken, actualizarUsuario);
router.delete("/usuarios/:documento", verificarToken, eliminarUsuario);

// Exportar router
export default router;