import { Router } from "express";
import { login, registrarRostro } from "../controllers/controller.auth.js";
import { verificarToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/registrar-rostro", verificarToken, registrarRostro);

export default router;