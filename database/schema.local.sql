CREATE DATABASE IF NOT EXISTS sistema_usuarios
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sistema_usuarios;

CREATE TABLE IF NOT EXISTS personal_militar (
    documento VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(254) NOT NULL,
    `contraseña` VARCHAR(255) NOT NULL,
    rango VARCHAR(100) DEFAULT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descriptor_facial LONGTEXT DEFAULT NULL,
    PRIMARY KEY (documento)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS accesos (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    documento VARCHAR(255) NOT NULL,
    hora TIME DEFAULT NULL,
    dia TINYINT UNSIGNED DEFAULT NULL,
    mes TINYINT UNSIGNED DEFAULT NULL,
    anio SMALLINT UNSIGNED DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_acceso DATETIME DEFAULT NULL,
    estado VARCHAR(50) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_accesos_documento (documento),
    KEY idx_accesos_created_at (created_at),
    KEY idx_accesos_fecha_acceso (fecha_acceso)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS saffe_codigos_recuperacion (
    documento VARCHAR(255) NOT NULL,
    codigo_hash CHAR(64) NOT NULL,
    token_hash CHAR(64) DEFAULT NULL,
    expira_en BIGINT UNSIGNED NOT NULL,
    creado_en BIGINT UNSIGNED NOT NULL,
    intentos TINYINT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (documento)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
