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
5. En desarrollo local, crea `backend/.env` a partir de `.env.example` y
   completa `DB_PASSWORD` con la contraseña real de MySQL. Para recuperación
   configura `SMTP_USER=saffe4808@gmail.com` y `SMTP_APP_PASSWORD` con una
   contraseña de aplicación de Google. De forma predeterminada se usa
   `smtp.gmail.com:465` con TLS implícito; si usas otro servidor, configura
   también `SMTP_HOST`, `SMTP_PORT` y `SMTP_SECURE` según los datos de tu
   proveedor. No compartas ni subas `.env` a Git.
   La recuperación busca `personal_militar.correo` por documento en cada
   solicitud; no hay un destinatario fijo ni caché de correos. Al cambiar esa
   columna, el siguiente código se envía al nuevo correo. Local y Railway usan
   bases de datos distintas, así que un cambio en una no modifica la otra.
   También se puede actualizar el correo mediante `PUT /api/usuarios/:documento`
   con autorización y solo el campo `correo`; la ruta valida y guarda el valor
   sin sobrescribir los demás datos del usuario.
6. En `frontend/.env`, configura `BACKEND_URL=http://localhost:3000` para que
   las páginas llamen al backend local.
7. Desde `backend`, ejecuta `npm run dev`; desde `frontend`, ejecuta
   `npm run dev`.
8. En Railway, configura `SMTP_USER` y `SMTP_APP_PASSWORD` como variables del
   servicio backend. Railway Free, Trial y Hobby bloquean el SMTP saliente;
   cambiar `SMTP_HOST` o el puerto no evita ese bloqueo. Para enviar por SMTP
   desde Railway se requiere un plan que permita conexiones SMTP; en los planes
   bloqueados, usa un proveedor con API HTTPS y adapta la integración o aloja el
   backend en un servicio que permita SMTP. Railway inyecta las variables MySQL
   (`MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`).
   En producción el backend usa las variables del servicio y no carga archivos
   `.env`.

No copies filas de usuarios reales de Railway a este entorno de prueba.
