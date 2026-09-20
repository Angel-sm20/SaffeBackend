// ------------------
// IMPORTAR CONEXIÓN
// ------------------

import conexion from "../config/database.js";

// --------------------------
// REGISTRAR UN NUEVO ACCESO
// --------------------------

export const registrarAcceso = async (req, res) => {

    try {

<<<<<<< HEAD
        const { estado } = req.body;
        const documento = req.usuario.documento;

        if (!estado) {
            return res.status(400).json({ mensaje: "El estado es obligatorio" });
        }

        const fechaAcceso = new Date();
=======
        const {

            usuario_id,
            lugar,
            estado,
            observacion

        } = req.body;

        const fecha = new Date().toISOString().split("T")[0];

        const hora = new Date().toTimeString().split(" ")[0];
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600

        const [resultado] = await conexion.query(

            `INSERT INTO accesos
<<<<<<< HEAD
            (documento, fecha_acceso, estado)
            VALUES (?, ?, ?)`,

            [documento, fechaAcceso, estado]
=======
            (usuario_id, fecha, hora, lugar, estado, observacion)
            VALUES (?, ?, ?, ?, ?, ?)`,

            [

                usuario_id,
                fecha,
                hora,
                lugar,
                estado,
                observacion

            ]
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600

        );

        res.status(201).json({

            mensaje: "Acceso registrado correctamente",

            id: resultado.insertId

        });

    } catch (error) {

        res.status(500).json({

            error: error.message

        });

    }

};

// ---------------
// LISTAR ACCESOS
// ---------------

export const listarAccesos = async (req, res) => {

    try {

        const [accesos] = await conexion.query(

            `SELECT
<<<<<<< HEAD
            documento,
            fecha_acceso,
            estado
            FROM accesos
            ORDER BY fecha_acceso DESC`
=======
            accesos.*,
            usuarios.nombre,
            usuarios.apellido
            FROM accesos
            INNER JOIN usuarios
            ON usuarios.id = accesos.usuario_id`
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600

        );

        res.json(accesos);

    } catch (error) {

        res.status(500).json({

            error: error.message

        });

    }

};

<<<<<<< HEAD

=======
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600
// --------------------------
// CONSULTAR ACCESO POR ID
// --------------------------

export const obtenerAcceso = async (req, res) => {

    try {

        const { id } = req.params;

        const [acceso] = await conexion.query(

            "SELECT * FROM accesos WHERE id=?",

            [id]

        );

        if (acceso.length === 0) {

            return res.status(404).json({

                mensaje: "Acceso no encontrado"

            });

        }

        res.json(acceso[0]);

    } catch (error) {

        res.status(500).json({

            error: error.message

        });

    }

};