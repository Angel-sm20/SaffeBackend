// ------------------
// IMPORTAR CONEXIÓN
// ------------------

import conexion from "../config/database.js";

// --------------------------
// REGISTRAR UN NUEVO ACCESO
// --------------------------

export const registrarAcceso = async (req, res) => {

    try {

        const { estado } = req.body;
        const documento = req.usuario.documento;

        if (!estado) {
            return res.status(400).json({ mensaje: "El estado es obligatorio" });
        }

        const fechaAcceso = new Date();

        const [resultado] = await conexion.query(

            `INSERT INTO accesos
            (documento, fecha_acceso, estado)
            VALUES (?, ?, ?)`,

            [documento, fechaAcceso, estado]

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
            documento,
            fecha_acceso,
            estado
            FROM accesos
            ORDER BY fecha_acceso DESC`

        );

        res.json(accesos);

    } catch (error) {

        res.status(500).json({

            error: error.message

        });

    }

};


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