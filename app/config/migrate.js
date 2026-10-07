import conexion from "./database.js";

const crearTablas = async () => {
    await conexion.query(`
        CREATE TABLE IF NOT EXISTS personal_militar (
            documento VARCHAR(255) NOT NULL,
            nombre VARCHAR(100) NOT NULL,
            apellido VARCHAR(100) NOT NULL,
            correo VARCHAR(254) NOT NULL,
            \`contraseña\` VARCHAR(255) NOT NULL,
            rango VARCHAR(100) DEFAULT NULL,
            fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            descriptor_facial LONGTEXT DEFAULT NULL,
            PRIMARY KEY (documento)
        ) ENGINE=InnoDB
          DEFAULT CHARACTER SET utf8mb4
          COLLATE utf8mb4_unicode_ci
    `);

    await conexion.query(`
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
          COLLATE utf8mb4_unicode_ci
    `);

    await conexion.query(`
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
          COLLATE utf8mb4_unicode_ci
    `);
};

const asegurarColumna = async (tabla, columna, definicion) => {
    const [columnas] = await conexion.query(
        `SELECT 1
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = ?
           AND COLUMN_NAME = ?
         LIMIT 1`,
        [tabla, columna]
    );

    if (columnas.length > 0) {
        return;
    }

    try {
        await conexion.query(
            `ALTER TABLE \`${tabla}\` ADD COLUMN \`${columna}\` ${definicion}`
        );
        console.log(`Database migration added ${tabla}.${columna}`);
    } catch (error) {
        if (error.code !== "ER_DUP_FIELDNAME") {
            throw error;
        }
    }
};

export const migrarBaseDeDatos = async () => {
    await conexion.query("SELECT 1");
    await crearTablas();

    await asegurarColumna("personal_militar", "correo", "VARCHAR(254) NULL");
    await asegurarColumna("personal_militar", "rango", "VARCHAR(100) NULL");
    await asegurarColumna("personal_militar", "fecha_registro", "DATETIME NULL");
    await asegurarColumna("personal_militar", "descriptor_facial", "LONGTEXT NULL");

    await asegurarColumna("accesos", "hora", "TIME NULL");
    await asegurarColumna("accesos", "dia", "TINYINT UNSIGNED NULL");
    await asegurarColumna("accesos", "mes", "TINYINT UNSIGNED NULL");
    await asegurarColumna("accesos", "anio", "SMALLINT UNSIGNED NULL");
    await asegurarColumna(
        "accesos",
        "created_at",
        "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
    );
    await asegurarColumna("accesos", "fecha_acceso", "DATETIME NULL");
    await asegurarColumna("accesos", "estado", "VARCHAR(50) NULL");

    await conexion.query(`
        UPDATE accesos
        SET fecha_acceso = created_at
        WHERE fecha_acceso IS NULL
    `);
};
