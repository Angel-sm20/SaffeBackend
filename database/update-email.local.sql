USE sistema_usuarios;

SET @documento = 'REEMPLAZAR_CON_EL_DOCUMENTO';
SET @correo = 'REEMPLAZAR_CON_EL_NUEVO_CORREO';

UPDATE personal_militar
SET correo = @correo
WHERE documento = @documento;

SELECT documento, correo
FROM personal_militar
WHERE documento = @documento;
