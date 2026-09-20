import conexion from "../config/database.js";

// ----------------------------
// VALIDAR ESCANEO FACIAL
// ----------------------------

export const validarEscaneo = async (req, res) => {

    try {

        const { documento } = req.body;

        const [usuario] = await conexion.query(

            "SELECT * FROM personal_militar WHERE documento = ?",

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