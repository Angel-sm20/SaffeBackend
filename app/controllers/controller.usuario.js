<<<<<<< HEAD
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
        const {
            nombre, apellido, documento, correo, contraseña, rango
        } = req.body;

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
        const valores = [nombre, apellido, documento, correo, rango, req.params.documento];
        let consulta = `UPDATE personal_militar
            SET nombre = ?, apellido = ?, documento = ?, correo = ?, rango = ?`;

        if (contraseña) {
            consulta += ", contraseña = ?";
            valores.splice(5, 0, contraseña);
        }

        consulta += " WHERE documento = ?";
        const [resultado] = await conexion.query(consulta, valores);

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
=======
// --------------------------
// IMPORTACIÓN DE LA CONEXIÓN
// --------------------------
import conexion from "../config/database.js";

// --------------------------
// OBTENER PERFIL DEL USUARIO (NUEVA)
// --------------------------
// Esta función usa el ID del token para devolver los datos del usuario actual
export const obtenerPerfil = async (req, res) => {
    try {
        // El middleware verificarToken debe inyectar el 'id' en req.usuario
        const id = req.usuario.id; 
        
        const [usuarios] = await conexion.query(
            "SELECT nombre, apellido, rol FROM usuarios WHERE id = ?",
            [id]
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

<<<<<<< HEAD
        return res.json(usuarios[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
=======
        res.json(usuarios[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --------------------------
// OBTENER TODOS LOS USUARIOS
// --------------------------
export const listarUsuarios = async (req, res) => {
    try {
        const [usuarios] = await conexion.query("SELECT * FROM usuarios");
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ----------------------------
// REGISTRAR UN NUEVO USUARIO
// ----------------------------
export const crearUsuario = async (req, res) => {
    try {
        const { nombre, apellido, documento, correo, contraseña, rol } = req.body;
        const [resultado] = await conexion.query(
            `INSERT INTO usuarios (nombre, apellido, documento, correo, contraseña, rol) VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, documento, correo, contraseña, rol]
        );
        res.status(201).json({ mensaje: "Usuario registrado correctamente", id: resultado.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -----------------------
// OBTENER USUARIO POR ID
// -----------------------
export const obtenerUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const [usuario] = await conexion.query("SELECT * FROM usuarios WHERE id = ?", [id]);
        if (usuario.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json(usuario[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -------------------
// ACTUALIZAR USUARIO
// -------------------
export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, documento, correo, contraseña, rol } = req.body;
        await conexion.query(
            `UPDATE usuarios SET nombre = ?, apellido = ?, documento = ?, correo = ?, contraseña = ?, rol = ? WHERE id = ?`,
            [nombre, apellido, documento, correo, contraseña, rol, id]
        );
        res.json({ mensaje: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -----------------
// ELIMINAR USUARIO
// -----------------
export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await conexion.query("DELETE FROM usuarios WHERE id = ?", [id]);
        res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600
