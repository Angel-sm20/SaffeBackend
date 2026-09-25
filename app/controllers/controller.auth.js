import conexion from "../config/database.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";

// 1. Inicio de sesión estándar (Contraseña)
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
            return res.status(401).json({ mensaje: "Documento no registrado" });
        }

        const usuario = usuarios[0];
        if (usuario.contraseña !== clave) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // --- REGISTRO DEL INGRESO EN LA TABLA ACCESOS ---
        const ahora = new Date();
        const hora = ahora.toLocaleTimeString("es-CO", { hour12: false });
        const dia = ahora.getDate();
        const mes = ahora.getMonth() + 1;
        const anio = ahora.getFullYear();

        await conexion.query(
            "INSERT INTO accesos (documento, hora, dia, mes, anio) VALUES (?, ?, ?, ?, ?)",
            [usuario.documento, hora, dia, mes, anio]
        );
        // ------------------------------------------------

        const token = jwt.sign(
            { documento: usuario.documento, nombre: usuario.nombre },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.json({ mensaje: "Inicio de sesión correcto", token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 2. Registro y vinculación del vector/descriptor facial
export const registrarRostro = async (req, res) => {
    try {
        const { documento, descriptor } = req.body;

        if (!documento || !descriptor) {
            return res.status(400).json({ 
                mensaje: "El documento y el descriptor facial son obligatorios" 
            });
        }

        // Convertir el vector biométrico a formato JSON para MySQL
        const descriptorJSON = JSON.stringify(descriptor);

        const [resultado] = await conexion.query(
            "UPDATE personal_militar SET descriptor_facial = ? WHERE documento = ?",
            [descriptorJSON, documento]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado en la base de datos" });
        }

        return res.json({ mensaje: "Rostro registrado y vinculado correctamente" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};