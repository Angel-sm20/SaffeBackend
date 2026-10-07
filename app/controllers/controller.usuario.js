import conexion from "../config/database.js";

const camposUsuario = "documento, nombre, apellido, correo, rango, fecha_registro";

const correoValido = (correo) =>
    typeof correo === "string" &&
    correo.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());

export const listarUsuarios = async (req, res) => {
    try {
        const [usuarios] = await conexion.query(
            `SELECT ${camposUsuario} FROM personal_militar ORDER BY fecha_registro DESC`
        );
        return res.json(usuarios);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const crearUsuario = async (req, res) => {
    try {
        const { nombre, apellido, documento, correo, contraseña, rango } = req.body;
        if (!nombre || !apellido || !documento || !correo || !contraseña) {
            return res.status(400).json({
                mensaje: "nombre, apellido, documento, correo y contraseña son obligatorios"
            });
        }
        if (!correoValido(correo)) {
            return res.status(400).json({ mensaje: "Ingresa un correo válido." });
        }

        await conexion.query(
            `INSERT INTO personal_militar
             (nombre, apellido, documento, correo, contraseña, rango, fecha_registro)
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [nombre, apellido, documento, correo.trim(), contraseña, rango || null]
        );
        return res.status(201).json({ mensaje: "Usuario registrado correctamente" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const obtenerUsuario = async (req, res) => {
    try {
        const [usuarios] = await conexion.query(
            `SELECT ${camposUsuario} FROM personal_militar WHERE documento = ?`,
            [req.params.documento]
        );
        if (usuarios.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        return res.json(usuarios[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const campos = [
            ["nombre", "nombre"],
            ["apellido", "apellido"],
            ["documento", "documento"],
            ["correo", "correo"],
            ["rango", "rango"],
            ["contraseña", "contraseña"]
        ];
        const asignaciones = [];
        const valores = [];

        for (const [propiedad, columna] of campos) {
            if (!Object.hasOwn(req.body, propiedad)) {
                continue;
            }

            let valor = req.body[propiedad];
            if (propiedad === "correo") {
                if (!correoValido(valor)) {
                    return res.status(400).json({
                        mensaje: "Ingresa un correo válido."
                    });
                }
                valor = valor.trim();
            }

            asignaciones.push(`\`${columna}\` = ?`);
            valores.push(valor);
        }

        if (asignaciones.length === 0) {
            return res.status(400).json({
                mensaje: "Indica al menos un campo para actualizar."
            });
        }

        valores.push(req.params.documento);
        const [resultado] = await conexion.query(
            `UPDATE personal_militar
             SET ${asignaciones.join(", ")}
             WHERE documento = ?`,
            valores
        );

        if (resultado.affectedRows === 0) {
            const [usuarios] = await conexion.query(
                "SELECT 1 FROM personal_militar WHERE documento = ? LIMIT 1",
                [req.params.documento]
            );
            if (usuarios.length === 0) {
                return res.status(404).json({ mensaje: "Usuario no encontrado" });
            }
        }

        return res.json({ mensaje: "Usuario actualizado correctamente" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const [resultado] = await conexion.query(
            "DELETE FROM personal_militar WHERE documento = ?",
            [req.params.documento]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        return res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const obtenerPerfil = async (req, res) => {
    try {
        const [usuarios] = await conexion.query(
            `SELECT ${camposUsuario} FROM personal_militar WHERE documento = ?`,
            [req.usuario.documento]
        );
        if (usuarios.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        return res.json(usuarios[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
