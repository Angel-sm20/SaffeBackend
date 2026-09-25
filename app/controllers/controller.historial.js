import conexion from "../config/database.js";

// Obtener la lista de accesos
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
        return res.status(500).json({ error: error.message });
    }
};

// Guardar un nuevo acceso tras el escaneo facial
export const registrarAcceso = async (req, res) => {
    try {
        const { documento, hora, dia, mes, anio } = req.body;

        await conexion.query(
            "INSERT INTO accesos (documento, hora, dia, mes, anio) VALUES (?, ?, ?, ?, ?)",
            [documento, hora, dia, mes, anio]
        );

        return res.json({ mensaje: "Acceso registrado correctamente" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};