import conexion from "../config/database.js";

export const obtenerHistorial = async (req, res) => {
    try {
        const [historial] = await conexion.query(
            `SELECT 
                a.documento, 
                p.nombre, 
                p.apellido,
                a.hora,
                a.dia,
                a.mes,
                a.anio
             FROM accesos a
             LEFT JOIN personal_militar p ON a.documento = p.documento
             ORDER BY a.id DESC
             LIMIT 50`
        );

        return res.json(historial);
    } catch (error) {
        console.error("Error en obtenerHistorial:", error);
        return res.status(500).json({
            error: error.message,
            mensaje: "Error al obtener el historial de accesos"
        });
    }
};