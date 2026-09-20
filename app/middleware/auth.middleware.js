import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";

export const verificarToken = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            mensaje: "Acceso denegado. Token no proporcionado."
        });
    }

    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
        return res.status(401).json({
            mensaje: "Acceso denegado. Token no proporcionado."
        });
    }

    try {
        req.usuario = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            mensaje: "Token inválido"
        });
    }
};
