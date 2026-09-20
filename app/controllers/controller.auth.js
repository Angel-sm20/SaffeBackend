import conexion from "../config/database.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";

export const login = async (req, res) => {
    try {
        const { documento, contraseña, contrasena } = req.body;
        const clave = contraseña ?? contrasena;

        if (!documento || !clave) {
            return res.status(400).json({
                mensaje: "El documento y la contraseña son obligatorios"
            });
        }

        const [usuarios] = await conexion.query(
            "SELECT * FROM personal_militar WHERE documento = ?",
            [documento]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensaje: "Documento no registrado"
            });
        }

        const usuario = usuarios[0];
        if (usuario.contraseña !== clave) {
            return res.status(401).json({
                mensaje: "Contraseña incorrecta"
            });
        }

        const token = jwt.sign(
            {
                documento: usuario.documento,
                nombre: usuario.nombre
            },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.json({
            mensaje: "Inicio de sesión correcto",
            token
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};
