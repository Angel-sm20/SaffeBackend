import { randomUUID } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";
const TIMEOUT_MS = 15000;

const obtenerConfiguracion = () => {
    const configuracion = {
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        sender: process.env.GMAIL_SENDER_EMAIL
    };

    if (Object.values(configuracion).some((valor) => !valor)) {
        throw new Error("Gmail API no está configurada.");
    }

    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(configuracion.sender)) {
        throw new Error("GMAIL_SENDER_EMAIL no es una dirección válida.");
    }

    return configuracion;
};

const codificarBase64 = (valor) => Buffer.from(valor, "utf8").toString("base64");

const codificarLineasBase64 = (valor) =>
    codificarBase64(valor).match(/.{1,76}/g).join("\r\n");

const crearMensajeMime = ({ sender, destinatario, codigo }) => {
    const frontera = `saffe_${randomUUID()}`;
    const texto =
        `Tu código de recuperación es ${codigo}. Vence en 10 minutos. ` +
        "Si no solicitaste este cambio, ignora este mensaje.";
    const html =
        `<p>Tu código de recuperación de SAFFE es:</p>` +
        `<p style="font-size:24px;font-weight:bold;letter-spacing:4px">${codigo}</p>` +
        "<p>Vence en 10 minutos. Si no solicitaste este cambio, ignora este mensaje.</p>";
    const asunto = codificarBase64("Código para recuperar tu contraseña - SAFFE");

    return [
        `From: SAFFE <${sender}>`,
        `To: ${destinatario}`,
        `Subject: =?UTF-8?B?${asunto}?=`,
        "MIME-Version: 1.0",
        `Content-Type: multipart/alternative; boundary="${frontera}"`,
        "",
        `--${frontera}`,
        'Content-Type: text/plain; charset="UTF-8"',
        "Content-Transfer-Encoding: base64",
        "",
        codificarLineasBase64(texto),
        `--${frontera}`,
        'Content-Type: text/html; charset="UTF-8"',
        "Content-Transfer-Encoding: base64",
        "",
        codificarLineasBase64(html),
        `--${frontera}--`,
        ""
    ].join("\r\n");
};

const obtenerTokenAcceso = async ({ clientId, clientSecret, refreshToken }) => {
    const respuesta = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token"
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS)
    });

    if (!respuesta.ok) {
        throw new Error(`Google OAuth rechazó la renovación del token (HTTP ${respuesta.status}).`);
    }

    const resultado = await respuesta.json();
    if (typeof resultado.access_token !== "string" || !resultado.access_token) {
        throw new Error("Google OAuth no devolvió un token de acceso.");
    }

    return resultado.access_token;
};

export const enviarCorreoGmail = async (destinatario, codigo) => {
    if (typeof destinatario !== "string" ||
        !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(destinatario)) {
        throw new Error("El destinatario registrado no es una dirección válida.");
    }
    if (!/^\d{6}$/.test(codigo)) {
        throw new Error("El código de recuperación debe tener seis dígitos.");
    }

    const configuracion = obtenerConfiguracion();
    const token = await obtenerTokenAcceso(configuracion);
    const mensaje = crearMensajeMime({
        sender: configuracion.sender,
        destinatario,
        codigo
    });
    const raw = Buffer.from(mensaje, "utf8").toString("base64url");

    const respuesta = await fetch(SEND_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ raw }),
        signal: AbortSignal.timeout(TIMEOUT_MS)
    });

    if (!respuesta.ok) {
        throw new Error(`Gmail API rechazó el envío del correo (HTTP ${respuesta.status}).`);
    }
};
