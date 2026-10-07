# Base de datos local

El backend usa MySQL. `schema.local.sql` crea la base `sistema_usuarios` y las
tablas compatibles con Railway:

- `personal_militar`, incluido el correo usado por recuperación de contraseña.
- `accesos`, con las columnas de la tabla existente y las columnas adicionales
  que requieren las rutas actuales de acceso.
- `saffe_codigos_recuperacion`, para los códigos temporales.

## Crear la base

1. Para desarrollo local, instala e inicia MySQL Server.
2. Ejecuta `schema.local.sql` en MySQL Workbench para crear la base local.
3. Opcionalmente, ejecuta `seed.local.sql` en Workbench para cargar los
   registros de prueba visibles en las capturas. Este archivo está excluido de
   Git. Las contraseñas originales no se copian: cada usuario recibe un hash
   aleatorio y tendrá que usar recuperación de contraseña para establecer una.
4. El backend ejecuta migraciones idempotentes al arrancar, creando las tablas
   faltantes y agregando las columnas de acceso que necesiten las consultas.
5. Para enviar correos en Railway sin SMTP ni un proveedor externo, configura
   Gmail API con OAuth:
   - En Google Cloud Console, crea un proyecto, habilita **Gmail API** y
     configura la pantalla de consentimiento OAuth como **External**.
   - En **Credentials**, crea un OAuth client de tipo **Web application** y
     agrega `https://developers.google.com/oauthplayground` como URI de
     redirección autorizada.
   - En [OAuth Playground](https://developers.google.com/oauthplayground),
     activa la opción de usar tus propias credenciales OAuth e ingresa el
     client ID y client secret. Autoriza el permiso
     `https://www.googleapis.com/auth/gmail.send`, intercambia el código por
     tokens y guarda el refresh token de forma privada.
   - En Railway, agrega `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`,
     `GMAIL_REFRESH_TOKEN` y `GMAIL_SENDER_EMAIL` en las variables del servicio
     backend. El correo remitente debe ser la misma cuenta que autorizó OAuth.
     No pongas los tokens en Git ni los compartas por chat.

   Si la aplicación OAuth externa permanece en estado **Testing**, Google puede
   hacer expirar el refresh token a los 7 días. Para uso permanente, configura
   el consentimiento OAuth para producción y completa la verificación de Google
   que solicite para el permiso sensible `gmail.send`. Mientras tanto, tendrás
   que renovar el refresh token al vencer. Railway inyecta las variables MySQL
   (`MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`);
   en producción usa las variables del servicio, no los archivos locales.
6. En desarrollo local, configura las variables en `.env.example` (el backend
   también lee `.env` si existe; este último tiene prioridad). `DB_PASSWORD`
   es la contraseña de MySQL. Para enviar correos localmente se requieren las
   mismas credenciales OAuth de Gmail API.
7. Desde `SaffeBackend`, ejecuta `npm run dev`.

No copies filas de usuarios reales de Railway a este entorno de prueba.
