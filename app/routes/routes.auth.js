import { Router } from "express";

import { login } from "../controllers/controller.auth.js";
import {
    enviarCodigoRecuperacion,
    restablecerContrasena,
    verificarCodigoRecuperacion
} from "../controllers/controller.recuperacion.js";

const router = Router();

// Ruta para iniciar sesión
router.post("/login", login);
router.post("/recuperacion/codigo", enviarCodigoRecuperacion);
router.post("/recuperacion/verificar", verificarCodigoRecuperacion);
router.post("/recuperacion/restablecer", restablecerContrasena);

export default router;
