# setup-starwars-project.ps1
# Script PowerShell para configurar el proyecto Star Wars en Windows

# Cómo usar el script:

#1. Crea un nuevo archivo en tu sistema con el nombre setup-starwars-project.ps1
#2. Copia y pega el contenido del script que te he proporcionado
#3. Abre PowerShell y ejecuta:
# Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
# .\setup-starwars-project.ps1

Write-Host "=== Configuración del proyecto Star Wars App ===" -ForegroundColor Green

# Crear la estructura de directorios
Write-Host "Creando estructura de directorios..." -ForegroundColor Cyan
mkdir starwars-app -ErrorAction SilentlyContinue
mkdir starwars-app\backend -ErrorAction SilentlyContinue
mkdir starwars-app\backend\src -ErrorAction SilentlyContinue
mkdir starwars-app\backend\src\controllers -ErrorAction SilentlyContinue
mkdir starwars-app\backend\src\models -ErrorAction SilentlyContinue
mkdir starwars-app\backend\src\repositories -ErrorAction SilentlyContinue
mkdir starwars-app\backend\src\services -ErrorAction SilentlyContinue
mkdir starwars-app\backend\src\routes -ErrorAction SilentlyContinue

# Crear archivo SQL para la base de datos
Write-Host "Creando script de base de datos..." -ForegroundColor Cyan
$sqlScript = @"
-- db_setup.sql

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS db_starwars;

-- Usar la base de datos
USE db_starwars;

-- Crear usuario y asignar permisos
CREATE USER 'sw_dev'@'%' IDENTIFIED BY 'Starwarsapp#666';
GRANT ALL PRIVILEGES ON db_starwars.* TO 'sw_dev'@'%';
FLUSH PRIVILEGES;

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

-- Añadir índices para mejorar el rendimiento
CREATE INDEX idx_person_swapiId ON Persons(swapiId);
CREATE INDEX idx_starship_swapiId ON Starships(swapiId);
"@

Set-Content -Path "starwars-app\backend\db_setup.sql" -Value $sqlScript

# Crear script batch para inicializar la base de datos
Write-Host "Creando script de inicialización de base de datos..." -ForegroundColor Cyan
$setupDbBatch = @"
@echo off
REM Script para configurar la base de datos en Windows
REM Asegúrate de tener MySQL/MariaDB instalado y accesible en el PATH

echo === Configurando base de datos StarWars ===

REM Ruta al archivo SQL con la configuración
set SQL_FILE=db_setup.sql

REM Credenciales para la conexión inicial como administrador
set ADMIN_USER=root
set /p ADMIN_PASSWORD=Ingresa la contraseña de root: 

REM Ejecutar el script SQL
echo Ejecutando script de configuración de la base de datos...
mysql -u%ADMIN_USER% -p%ADMIN_PASSWORD% < %SQL_FILE%

IF %ERRORLEVEL% NEQ 0 (
  echo ERROR: No se pudo ejecutar el script SQL.
  echo Asegúrate de que:
  echo  - MySQL/MariaDB está instalado y en ejecución
  echo  - Las credenciales son correctas
  echo  - El usuario tiene permisos para crear bases de datos y usuarios
  exit /b 1
) ELSE (
  echo Base de datos db_starwars creada correctamente.
  echo Usuario sw_dev creado con los permisos necesarios.
  echo Tablas iniciales creadas.
  echo ¡Configuración completada con éxito!
)

echo.
echo Ahora puedes iniciar la aplicación con:
echo npm run dev
echo.
"@

Set-Content -Path "starwars-app\backend\setup-db.bat" -Value $setupDbBatch

# Crear archivo .env.example
Write-Host "Creando archivo .env.example..." -ForegroundColor Cyan
$envExample = @"
# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=db_starwars
DB_USER=sw_dev
DB_PASSWORD=Starwarsapp#666

# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de sincronización de base de datos
# true: usar sequelize.sync() para crear/actualizar tablas automáticamente
# false: confiar en las tablas creadas por el script SQL
AUTO_SYNC=false
"@

Set-Content -Path "starwars-app\backend\.env.example" -Value $envExample
Copy-Item "starwars-app\backend\.env.example" -Destination "starwars-app\backend\.env"

# Crear .gitignore
Write-Host "Creando archivo .gitignore..." -ForegroundColor Cyan
$gitignore = @"
node_modules/
.env
.DS_Store
npm-debug.log
dist/
"@

Set-Content -Path "starwars-app\backend\.gitignore" -Value $gitignore

# Crear package.json
Write-Host "Creando package.json..." -ForegroundColor Cyan
$packageJson = @"
{
  "name": "starwars-backend",
  "version": "1.0.0",
  "description": "Backend para la aplicación Star Wars",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "starwars",
    "api",
    "express",
    "sequelize"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.6.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "mariadb": "^3.2.2",
    "sequelize": "^6.35.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
"@

Set-Content -Path "starwars-app\backend\package.json" -Value $packageJson

Write-Host "Estructura básica del proyecto creada con éxito!" -ForegroundColor Green
Write-Host "Para continuar:" -ForegroundColor Yellow
Write-Host "1. Navega al directorio del backend: cd starwars-app\backend" -ForegroundColor Yellow
Write-Host "2. Instala las dependencias: npm install" -ForegroundColor Yellow
Write-Host "3. Configura la base de datos: setup-db.bat" -ForegroundColor Yellow
Write-Host "4. Inicia el servidor de desarrollo: npm run dev" -ForegroundColor Yellow

# Preguntar si desea instalar dependencias automáticamente
$installDeps = Read-Host "¿Deseas instalar las dependencias del backend ahora? (S/N)"
if ($installDeps -eq "S" -or $installDeps -eq "s") {
    Write-Host "Instalando dependencias del backend..." -ForegroundColor Cyan
    Set-Location -Path "starwars-app\backend"
    npm install
    Write-Host "Dependencias instaladas correctamente" -ForegroundColor Green
    
    $setupDb = Read-Host "¿Deseas configurar la base de datos ahora? (S/N)"
    if ($setupDb -eq "S" -or $setupDb -eq "s") {
        Write-Host "Ejecutando script de configuración de la base de datos..." -ForegroundColor Cyan
        .\setup-db.bat
    }
}