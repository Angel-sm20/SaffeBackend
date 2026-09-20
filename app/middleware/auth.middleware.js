<<<<<<< HEAD
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";

export const verificarToken = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            mensaje: "Acceso denegado. Token no proporcionado."
        });
    }

    const token = authorization.slice("Bearer ".length).trim();
=======
// --------------
// IMPORTACIONES
// --------------
import jwt from "jsonwebtoken";

// Clave secreta utilizada para validar el token
const SECRET = "mi_clave_super_secreta";

// ---------------
// VERIFICAR TOKEN
// ---------------
export const verificarToken = (req, res, next) => {
    // Obtiene el token del encabezado Authorization
    const token = req.headers.authorization;

>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600
    if (!token) {
        return res.status(401).json({
            mensaje: "Acceso denegado. Token no proporcionado."
        });
    }

    try {
<<<<<<< HEAD
        req.usuario = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            mensaje: "Token inválido"
        });
    }
};
=======
        // Elimina la palabra Bearer
        const tokenLimpio = token.replace("Bearer ", "");

        // VERIFICACIÓN: Verificamos y GUARDAMOS el contenido del token
        const decoded = jwt.verify(tokenLimpio, SECRET);
        
        // ¡ESTO ES LO QUE FALTABA!
        // Ahora el controlador podrá hacer: const id = req.usuario.id;
        req.usuario = decoded; 

        // Continúa con la siguiente función
        next();
    } catch (error) {
        res.status(401).json({
            mensaje: "Token inválido"
        });
    }
};
>>>>>>> 03a4331f49896e6306a7f8d4c5b8729c071f8600
