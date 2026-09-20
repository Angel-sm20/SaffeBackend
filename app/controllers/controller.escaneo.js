import conexion from "../config/database.js";

export const validarEscaneo = async (req, res) => {
    try {
        const { documento } = req.body;
        if (!documento) {
            return res.status(400).json({ mensaje: "El documento es obligatorio" });
        }

        const [usuarios] = await conexion.query(
            "SELECT * FROM personal_militar WHERE documento = ?",
            [documento]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                acceso: false,
                mensaje: "Usuario no encontrado"
            });
        }

        return res.json({
            acceso: true,
            mensaje: "Acceso autorizado",
            usuario: usuarios[0]
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
