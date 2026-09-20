import conexion from "../config/database.js";

// ----------------------------
<<<<<<< HEAD
// OBTENER HISTORIAL DE ACCESOS DEL USUARIO
=======
// OBTENER HISTORIAL DE ACCESOS
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600
// ----------------------------

export const obtenerHistorial = async (req, res) => {

    try {

<<<<<<< HEAD
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

=======
        const [historial] = await conexion.query(

            `SELECT

                usuarios.id,
                usuarios.nombre,
                usuarios.apellido,

                accesos.fecha,
                accesos.hora,
                accesos.estado,
                accesos.lugar

            FROM accesos

            INNER JOIN usuarios

            ON usuarios.id = accesos.usuario_id

            ORDER BY accesos.fecha DESC,
            accesos.hora DESC`

        );

>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600
        res.json(historial);

    } catch (error) {

<<<<<<< HEAD
        console.error("Error en obtenerHistorial:", error.message);

        res.status(500).json({

            error: error.message,
            mensaje: "Error al obtener el historial de accesos"
=======
        res.status(500).json({

            error: error.message
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600

        });

    }

};
