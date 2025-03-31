-- db_setup.sql

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS db_starwars;

-- Usar la base de datos
USE db_starwars;

-- Crear usuario y asignar permisos
CREATE USER 'sw_dev'@'%' IDENTIFIED BY 'Starwarsapp#666';
GRANT ALL PRIVILEGES ON db_starwars.* TO 'sw_dev'@'%';
FLUSH PRIVILEGES;

-- Opcional: Crear tablas manualmente si no se usa sequelize.sync()
-- Tabla de Personas
CREATE TABLE IF NOT EXISTS Persons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  height VARCHAR(50),
  mass VARCHAR(50),
  swapiId VARCHAR(100) UNIQUE,
  isDeleted BOOLEAN DEFAULT false,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Naves
CREATE TABLE IF NOT EXISTS Starships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  model VARCHAR(255),
  swapiId VARCHAR(100) UNIQUE,
  isDeleted BOOLEAN DEFAULT false,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de relación muchos a muchos
CREATE TABLE IF NOT EXISTS PersonStarships (
  PersonId INT NOT NULL,
  StarshipId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (PersonId, StarshipId),
  FOREIGN KEY (PersonId) REFERENCES Persons(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (StarshipId) REFERENCES Starships(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Opcional: Añadir índices para mejorar el rendimiento
CREATE INDEX idx_person_swapiId ON Persons(swapiId);
CREATE INDEX idx_starship_swapiId ON Starships(swapiId);