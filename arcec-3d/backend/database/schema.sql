-- ============================================================
-- ARCEC-3D — Esquema de base de datos MySQL
-- CENIDET · Departamento de Ciencias Computacionales
-- ============================================================

CREATE DATABASE IF NOT EXISTS arcec3d
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE arcec3d;

-- Tabla de usuarios (investigadores/académicos)
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario          INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo      VARCHAR(150)  NOT NULL,
  correo_institucional VARCHAR(150)  NOT NULL UNIQUE,
  contrasena           VARCHAR(255)  NOT NULL,
  fecha_registro       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de funciones destacadas (historial de experimentos guardados)
CREATE TABLE IF NOT EXISTS funciones_destacadas (
  id_funcion            INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario            INT NOT NULL,
  expresion_algebraica  VARCHAR(1000) NOT NULL,
  nombre_experimento    VARCHAR(150)  NOT NULL,
  imagen_preview        LONGTEXT,
  fecha_guardado        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_funcion_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_funciones_usuario ON funciones_destacadas(id_usuario);
