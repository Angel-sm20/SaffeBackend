import { Router } from "express";

import { login } from "../controllers/controller.auth.js";

const router = Router();

// Ruta para iniciar sesión
router.post("/login", login);

export default router;
