USE sistema_usuarios;

UPDATE personal_militar
SET correo = 'angelmahecha25@gmail.com'
WHERE documento = '123456888';

SELECT documento, correo
FROM personal_militar
WHERE documento = '123456888';
