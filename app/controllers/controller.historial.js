import conexion from "../config/database.js";

// ----------------------------
// OBTENER HISTORIAL DE ACCESOS DEL USUARIO
// ----------------------------

export const obtenerHistorial = async (req, res) => {

    try {

        // Obtiene el documento del usuario desde el token
        const usuarioDocumento = req.usuario.documento;

        console.log("Buscando historial para documento:", usuarioDocumento);

        // Obtiene el historial del usuario autenticado
        const [historial] = await conexion.query(

            `SELECT 
                a.documento,
                p.nombre,
                p.apellido,
                DATE_FORMAT(a.fecha_acceso, '%H:%i') as hora,
                DATE_FORMAT(a.fecha_acceso, '%d') as dia,
                DATE_FORMAT(a.fecha_acceso, '%m') as mes,
                DATE_FORMAT(a.fecha_acceso, '%Y') as anio,
                a.estado

            FROM accesos a

            LEFT JOIN personal_militar p ON a.documento = p.documento

            WHERE a.documento = ?

            ORDER BY a.fecha_acceso DESC

            LIMIT 50`,

            [usuarioDocumento]

        );

        console.log("Historial encontrado:", historial);

        res.json(historial);

    } catch (error) {

        console.error("Error en obtenerHistorial:", error.message);

        res.status(500).json({

            error: error.message,
            mensaje: "Error al obtener el historial de accesos"

        });

    }

};
