// -------------------------
// IMPORTACIÓN DE LIBRERÍAS
// -------------------------

// Importa Router de Express
import { Router } from "express";

// Importación de controladores
import {
    listarUsuarios,
<<<<<<< HEAD
    crearUsuario,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerPerfil
=======
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerPerfil // <--- ¡AQUÍ ESTABA EL ERROR! Faltaba importar esta función
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600
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

<<<<<<< HEAD
// Obtener perfil del usuario autenticado
router.get("/perfil", verificarToken, obtenerPerfil);
router.get("/usuarios", verificarToken, listarUsuarios);
router.post("/usuarios", crearUsuario);
router.get("/usuarios/:documento", verificarToken, obtenerUsuario);
router.put("/usuarios/:documento", verificarToken, actualizarUsuario);
router.delete("/usuarios/:documento", verificarToken, eliminarUsuario);
=======
// Obtener perfil del usuario logueado (Debe ir antes de /usuarios/:id para evitar conflictos)
router.get("/perfil", verificarToken, obtenerPerfil);

// Obtener todos los usuarios
router.get("/usuarios", verificarToken, listarUsuarios);

// Obtener usuario por ID
router.get("/usuarios/:id", verificarToken, obtenerUsuario);

// Crear usuario
router.post("/usuarios", verificarToken, crearUsuario);

// Actualizar usuario
router.put("/usuarios/:id", verificarToken, actualizarUsuario);

// Eliminar usuario
router.delete("/usuarios/:id", verificarToken, eliminarUsuario);
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600

// Exportar router
export default router;