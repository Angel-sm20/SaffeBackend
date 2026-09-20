import conexion from "../config/database.js";

const camposUsuario = "documento, nombre, apellido, correo, rango, fecha_registro";

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

        await conexion.query(
            `INSERT INTO personal_militar
             (nombre, apellido, documento, correo, contraseña, rango, fecha_registro)
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [nombre, apellido, documento, correo, contraseña, rango || null]
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
        const { nombre, apellido, documento, correo, contraseña, rango } = req.body;
        const valores = [nombre, apellido, documento, correo, rango];
        let consulta = `UPDATE personal_militar
                        SET nombre = ?, apellido = ?, documento = ?, correo = ?, rango = ?`;

        if (contraseña) {
            consulta += ", contraseña = ?";
            valores.push(contraseña);
        }

        valores.push(req.params.documento);
        const [resultado] = await conexion.query(
            `${consulta} WHERE documento = ?`,
            valores
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
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
