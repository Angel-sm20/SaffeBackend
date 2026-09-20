import conexion from "../config/database.js";

// ----------------------------
<<<<<<< HEAD
// VALIDAR ESCANEO FACIAL
=======
// VALIDAR ESCANEO (SIMULADO)
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600
// ----------------------------

export const validarEscaneo = async (req, res) => {

    try {

        const { documento } = req.body;

        const [usuario] = await conexion.query(

<<<<<<< HEAD
            "SELECT * FROM personal_militar WHERE documento = ?",
=======
            "SELECT * FROM usuarios WHERE documento = ?",
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600

            [documento]

        );

        if (usuario.length === 0) {

            return res.status(404).json({

                acceso: false,

                mensaje: "Usuario no encontrado"

            });

        }

        res.json({

            acceso: true,

            mensaje: "Acceso autorizado",

            usuario: usuario[0]

        });

    } catch (error) {

        res.status(500).json({

            error: error.message

        });

    }

};