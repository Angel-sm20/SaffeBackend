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
5. Railway Free, Trial y Hobby bloquean SMTP saliente. En Resend, verifica un
   dominio que controles y crea una API key. En las variables del servicio
   backend en Railway configura `RESEND_API_KEY` y
   `RESEND_FROM_EMAIL` (por ejemplo, `SAFFE <no-reply@tu-dominio-verificado>`),
   y vuelve a desplegar. Railway inyecta las variables MySQL
   (`MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`).
   En producción el backend no lee archivos `.env`, por lo que usa las
   variables del servicio.
6. En desarrollo local, configura las variables en `.env.example` (el backend
   también lee `.env` si existe; este último tiene prioridad). `DB_PASSWORD`
   es la contraseña de MySQL. Para enviar correos localmente configura también
   `RESEND_API_KEY` y `RESEND_FROM_EMAIL`.
7. Desde `SaffeBackend`, ejecuta `npm run dev`.

No copies filas de usuarios reales de Railway a este entorno de prueba.
