import { Router } from "express";
import {
    listarUsuarios,
    crearUsuario,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerPerfil
} from "../controllers/controller.usuario.js";
import { verificarToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/perfil", verificarToken, obtenerPerfil);
router.get("/usuarios", verificarToken, listarUsuarios);
router.post("/usuarios", crearUsuario);
router.get("/usuarios/:documento", verificarToken, obtenerUsuario);
router.put("/usuarios/:documento", verificarToken, actualizarUsuario);
router.delete("/usuarios/:documento", verificarToken, eliminarUsuario);

export default router;
