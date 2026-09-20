import conexion from "../config/database.js";

export const registrarAcceso = async (req, res) => {
    try {
        const { estado } = req.body;
        const documento = req.usuario.documento;

        if (!estado) {
            return res.status(400).json({ mensaje: "El estado es obligatorio" });
        }

        const [resultado] = await conexion.query(
            `INSERT INTO accesos (documento, fecha_acceso, estado)
             VALUES (?, ?, ?)`,
            [documento, new Date(), estado]
        );

        return res.status(201).json({
            mensaje: "Acceso registrado correctamente",
            id: resultado.insertId
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const listarAccesos = async (req, res) => {
    try {
        const [accesos] = await conexion.query(
            `SELECT documento, fecha_acceso, estado
             FROM accesos ORDER BY fecha_acceso DESC`
        );
        return res.json(accesos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const obtenerAcceso = async (req, res) => {
    try {
        const [accesos] = await conexion.query(
            "SELECT * FROM accesos WHERE id = ?",
            [req.params.id]
        );

        if (accesos.length === 0) {
            return res.status(404).json({ mensaje: "Acceso no encontrado" });
        }

        return res.json(accesos[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
