<<<<<<< HEAD
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
=======
// --------------
// IMPORTACIONES
// --------------

import conexion from "../config/database.js";
import jwt from "jsonwebtoken";

// Clave secreta para generar el token
const SECRET = "mi_clave_super_secreta";

// ------
// LOGIN
// ------

export const login = async (req, res) => {

    try {

        console.log(req.body);

        const { correo, contraseña } = req.body;

        // Busca el usuario por correo
        const [usuarios] = await conexion.query(

            "SELECT * FROM usuarios WHERE correo = ?",

            [correo]

        );

        // Verifica si el usuario existe
        if (usuarios.length === 0) {

            return res.status(401).json({

                mensaje: "Correo no registrado"

            });

        }

        const usuario = usuarios[0];

        // Verifica la contraseña
        if (usuario.contraseña !== contraseña) {

            return res.status(401).json({

                mensaje: "Contraseña incorrecta"

            });

        }

        // Genera el token
        const token = jwt.sign(

            {
                id: usuario.id,
                correo: usuario.correo
            },

            SECRET,

            {
                expiresIn: "2h"
            }

        );

        // Devuelve el token
        res.json({

            mensaje: "Inicio de sesión correcto",

            token

        });

    } catch (error) {

        res.status(500).json({

            error: error.message

        });

    }

};
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600
