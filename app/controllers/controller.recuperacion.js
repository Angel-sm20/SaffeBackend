import {
    createHash,
    createHmac,
    randomBytes,
    randomInt,
    timingSafeEqual
} from "node:crypto";
import conexion from "../config/database.js";
import { JWT_SECRET } from "../config/auth.js";
import bcrypt from "bcryptjs";
import { enviarCorreoGmail } from "../services/gmail.js";

const DURACION_CODIGO_MS = 10 * 60 * 1000;
const INTERVALO_REENVIO_MS = 60 * 1000;
const MAX_INTENTOS = 5;

const hashCodigo = (codigo) =>
    createHmac("sha256", JWT_SECRET).update(codigo).digest("hex");

const hashToken = (token) => createHash("sha256").update(token).digest("hex");

const coincideHash = (actual, esperado) => {
    const hashActual = Buffer.from(actual, "hex");
    const hashEsperado = Buffer.from(esperado, "hex");
    return hashActual.length === hashEsperado.length &&
        timingSafeEqual(hashActual, hashEsperado);
};

const correoGenerico =
    "Si el documento está registrado y tiene un correo asociado, enviaremos un código de recuperación.";

export const enviarCodigoRecuperacion = async (req, res) => {
    try {
        const documento = typeof req.body.documento === "string"
            ? req.body.documento.trim()
            : "";

        if (!documento || documento.length > 255) {
            return res.status(400).json({ mensaje: "Ingresa un documento válido." });
        }

        const configuracionGmail = [
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            process.env.GMAIL_REFRESH_TOKEN,
            process.env.GMAIL_SENDER_EMAIL
        ];
        if (configuracionGmail.some((valor) => !valor)) {
            return res.status(503).json({
                mensaje: "El servicio de correo Gmail API no está configurado en el servidor."
            });
        }

        const [usuarios] = await conexion.query(
            "SELECT correo FROM personal_militar WHERE documento = ?",
            [documento]
        );

        if (usuarios.length === 0 || !usuarios[0].correo) {
            return res.json({ mensaje: correoGenerico });
        }

        const ahora = Date.now();
        const [solicitudes] = await conexion.query(
            "SELECT creado_en FROM saffe_codigos_recuperacion WHERE documento = ?",
            [documento]
        );

        if (solicitudes.length > 0 &&
            ahora - Number(solicitudes[0].creado_en) < INTERVALO_REENVIO_MS) {
            return res.json({ mensaje: correoGenerico });
        }

        const codigo = String(randomInt(0, 1_000_000)).padStart(6, "0");
        const expiraEn = ahora + DURACION_CODIGO_MS;

        await conexion.query(
            `INSERT INTO saffe_codigos_recuperacion
                (documento, codigo_hash, token_hash, expira_en, creado_en, intentos)
             VALUES (?, ?, NULL, ?, ?, 0)
             ON DUPLICATE KEY UPDATE
                codigo_hash = VALUES(codigo_hash),
                token_hash = NULL,
                expira_en = VALUES(expira_en),
                creado_en = VALUES(creado_en),
                intentos = 0`,
            [documento, hashCodigo(codigo), expiraEn, ahora]
        );

        try {
            await enviarCorreoGmail(usuarios[0].correo, codigo);
        } catch (error) {
            await conexion.query(
                "DELETE FROM saffe_codigos_recuperacion WHERE documento = ?",
                [documento]
            );
            throw error;
        }

        return res.json({ mensaje: correoGenerico });
    } catch (error) {
        console.error(
            "Error al enviar código de recuperación:",
            error.message
        );
        return res.status(500).json({
            mensaje: "No se pudo enviar el código de recuperación. Inténtalo de nuevo más tarde."
        });
    }
};

export const verificarCodigoRecuperacion = async (req, res) => {
    try {
        const documento = typeof req.body.documento === "string"
            ? req.body.documento.trim()
            : "";
        const codigo = typeof req.body.codigo === "string"
            ? req.body.codigo.trim()
            : "";

        if (!documento || !/^\d{6}$/.test(codigo)) {
            return res.status(400).json({ mensaje: "Documento o código no válido." });
        }

        const [solicitudes] = await conexion.query(
            `SELECT codigo_hash, expira_en, intentos
             FROM saffe_codigos_recuperacion
             WHERE documento = ?`,
            [documento]
        );

        if (solicitudes.length === 0) {
            return res.status(400).json({ mensaje: "El código es inválido o venció." });
        }

        const solicitud = solicitudes[0];
        if (Number(solicitud.expira_en) <= Date.now()) {
            await conexion.query(
                "DELETE FROM saffe_codigos_recuperacion WHERE documento = ?",
                [documento]
            );
            return res.status(400).json({ mensaje: "El código es inválido o venció." });
        }

        if (Number(solicitud.intentos) >= MAX_INTENTOS) {
            return res.status(429).json({
                mensaje: "Se superó el número de intentos. Solicita un código nuevo."
            });
        }

        if (!coincideHash(hashCodigo(codigo), solicitud.codigo_hash)) {
            await conexion.query(
                `UPDATE saffe_codigos_recuperacion
                 SET intentos = intentos + 1
                 WHERE documento = ?`,
                [documento]
            );
            return res.status(400).json({ mensaje: "El código es inválido o venció." });
        }

        const token = randomBytes(32).toString("hex");
        await conexion.query(
            `UPDATE saffe_codigos_recuperacion
             SET token_hash = ?, intentos = 0
             WHERE documento = ?`,
            [hashToken(token), documento]
        );

        return res.json({ mensaje: "Código confirmado.", token });
    } catch (error) {
        console.error("Error al verificar código de recuperación:", error);
        return res.status(500).json({
            mensaje: "No se pudo verificar el código. Inténtalo de nuevo más tarde."
        });
    }
};

export const restablecerContrasena = async (req, res) => {
    const token = typeof req.body.token === "string" ? req.body.token : "";
    const documento = typeof req.body.documento === "string"
        ? req.body.documento.trim()
        : "";
    const contrasena = typeof req.body.contrasena === "string"
        ? req.body.contrasena
        : "";

    if (!documento ||
        !token ||
        token.length > 128 ||
        contrasena.length < 8 ||
        Buffer.byteLength(contrasena, "utf8") > 72) {
        return res.status(400).json({
            mensaje: "Ingresa una contraseña de 8 a 72 bytes y una autorización válida."
        });
    }

    let conexionTransaccion;
    let transaccionIniciada = false;
    try {
        const contrasenaHash = await bcrypt.hash(contrasena, 12);
        conexionTransaccion = await conexion.getConnection();
        await conexionTransaccion.beginTransaction();
        transaccionIniciada = true;

        const [solicitudes] = await conexionTransaccion.query(
            `SELECT token_hash, expira_en
             FROM saffe_codigos_recuperacion
             WHERE documento = ?
             FOR UPDATE`,
            [documento]
        );

        if (solicitudes.length === 0 ||
            !solicitudes[0].token_hash ||
            Number(solicitudes[0].expira_en) <= Date.now() ||
            !coincideHash(hashToken(token), solicitudes[0].token_hash)) {
            await conexionTransaccion.rollback();
            transaccionIniciada = false;
            return res.status(400).json({
                mensaje: "La autorización para cambiar la contraseña es inválida o venció."
            });
        }

        const [usuarios] = await conexionTransaccion.query(
            "SELECT documento FROM personal_militar WHERE documento = ? FOR UPDATE",
            [documento]
        );

        if (usuarios.length === 0) {
            await conexionTransaccion.rollback();
            transaccionIniciada = false;
            return res.status(404).json({ mensaje: "No se encontró el usuario." });
        }

        await conexionTransaccion.query(
            "UPDATE personal_militar SET contraseña = ? WHERE documento = ?",
            [contrasenaHash, documento]
        );

        await conexionTransaccion.query(
            "DELETE FROM saffe_codigos_recuperacion WHERE documento = ?",
            [documento]
        );
        await conexionTransaccion.commit();
        transaccionIniciada = false;

        return res.json({ mensaje: "La contraseña se actualizó correctamente." });
    } catch (error) {
        if (conexionTransaccion && transaccionIniciada) {
            await conexionTransaccion.rollback();
        }
        console.error("Error al restablecer contraseña:", error);
        return res.status(500).json({
            mensaje: "No se pudo actualizar la contraseña. Inténtalo de nuevo más tarde."
        });
    } finally {
        if (conexionTransaccion) {
            conexionTransaccion.release();
        }
    }
};
