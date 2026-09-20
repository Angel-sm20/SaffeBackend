import conexion from "../config/database.js";

export const obtenerHistorial = async (req, res) => {
    try {
        const [historial] = await conexion.query(
            `SELECT a.documento, p.nombre, p.apellido,
                    DATE_FORMAT(a.fecha_acceso, '%H:%i') AS hora,
                    DATE_FORMAT(a.fecha_acceso, '%d') AS dia,
                    DATE_FORMAT(a.fecha_acceso, '%m') AS mes,
                    DATE_FORMAT(a.fecha_acceso, '%Y') AS anio,
                    a.estado
             FROM accesos a
             LEFT JOIN personal_militar p ON a.documento = p.documento
             WHERE a.documento = ?
             ORDER BY a.fecha_acceso DESC
             LIMIT 50`,
            [req.usuario.documento]
        );

        return res.json(historial);
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            mensaje: "Error al obtener el historial de accesos"
        });
    }
};
