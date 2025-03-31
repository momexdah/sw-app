# Star Wars App - Prueba Técnica Fullstack

Aplicación fullstack que muestra información sobre personajes de Star Wars y sus naves asociadas, utilizando Angular en el frontend, Node.js + Express en el backend, y MariaDB como base de datos.

## Tecnologías utilizadas

### Backend
- Node.js
- Express
- Sequelize (ORM)
- MariaDB
- Axios (para consumir SWAPI)

### Frontend
- Angular 18
- Bootstrap 
- SweetAlert2
- Angular HttpClient

## Estructura del proyecto

```
/backend         # API REST con Node.js
/frontend        # Aplicación Angular
README.md
db_setup.sql     # Script para configurar la base de datos
setup-starwars-project.ps1     # Script PowerShell para la configuración en Windows
```

## Requisitos previos

- Node.js (v16 o superior)
- npm (v8 o superior)
- MariaDB (o MySQL)
- Angular CLI (para Angular 18)

## Instrucciones de instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/momexdah/sw-app.git
cd sw-app
```

### 2. Configuración de la base de datos

Hay dos formas de configurar la base de datos:

#### Opción 1: Usando el script de configuración (recomendado para Windows)

1. Asegúrate de tener MariaDB o MySQL instalado y en ejecución.

2. Ejecuta el script PowerShell para configurar la base de datos:

   ```powershell
   # Primero, establece la política de ejecución para permitir el script
   Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
   
   # Luego ejecuta el script
   .\setup-starwars-project.ps1
   ```

3. El script te guiará a través del proceso de configuración y te pedirá la contraseña de root cuando sea necesario.

#### Opción 2: Configuración manual (para cualquier sistema operativo)

1. Conecta a tu servidor MariaDB o MySQL:

   ```
   mysql -u root -p
   ```

2. Ejecuta el script SQL manualmente:

   ```
   mysql -u root -p < backend/db_setup.sql
   ```

   O copia y pega el contenido del archivo `db_setup.sql` en tu cliente de MySQL.

### 3. Configuración del backend

1. Configura las variables de entorno:

   ```bash
   cd backend
   cp .env.example .env
   ```

   Verifica que las credenciales en `.env` sean correctas:

   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=db_starwars
   DB_USER=sw_dev
   DB_PASSWORD=Starwarsapp#666
   PORT=3000
   AUTO_SYNC=false
   ```

2. Instala las dependencias del backend:

   ```bash
   cd backend
   npm install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   El servidor se ejecutará en `http://localhost:3000`.

### 4. Configuración del frontend

1. Instala las dependencias del frontend:

   ```bash
   cd frontend
   npm install
   ```

2. Inicia el servidor de desarrollo:

   ```bash
   ng serve
   ```

   La aplicación estará disponible en `http://localhost:4200`.

## Uso de la aplicación

1. Abre tu navegador y ve a `http://localhost:4200`
2. Haz clic en el botón "Cargar datos de SWAPI" para inicializar la base de datos con personajes y naves
3. Explora la lista de personajes
4. Haz clic en "Ver naves" para ver las naves asociadas a un personaje
5. Haz clic en "Eliminar" para realizar un borrado lógico de un personaje

## API Endpoints

- `GET /api/persons` - Obtener todos los personajes
- `GET /api/persons/:id` - Obtener un personaje por ID
- `GET /api/persons/:id/ships` - Obtener las naves de un personaje
- `DELETE /api/persons/:id` - Eliminar un personaje (borrado lógico)
- `POST /api/initialize` - Inicializar datos desde SWAPI

## Solución de problemas

### Problemas de conexión a la base de datos

Si encuentras errores de "Access denied" para el usuario 'sw_dev':

1. Verifica que la base de datos y el usuario existen:
   ```sql
   SHOW DATABASES;
   SELECT User, Host FROM mysql.user WHERE User = 'sw_dev';
   ```

2. Verifica los permisos del usuario:
   ```sql
   SHOW GRANTS FOR 'sw_dev'@'%';
   SHOW GRANTS FOR 'sw_dev'@'localhost';
   ```

3. Si es necesario, recrea el usuario:
   ```sql
   DROP USER IF EXISTS 'sw_dev'@'%';
   DROP USER IF EXISTS 'sw_dev'@'localhost';
   CREATE USER 'sw_dev'@'%' IDENTIFIED BY 'Starwarsapp#666';
   CREATE USER 'sw_dev'@'localhost' IDENTIFIED BY 'Starwarsapp#666';
   GRANT ALL PRIVILEGES ON db_starwars.* TO 'sw_dev'@'%';
   GRANT ALL PRIVILEGES ON db_starwars.* TO 'sw_dev'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. Alternativa: Usa el usuario root temporalmente (solo para desarrollo):
   ```
   DB_USER=root
   DB_PASSWORD=tu_contraseña_de_root
   ```

### Errores comunes en Angular 18

1. **Advertencias de compilación sobre propiedades posiblemente 'undefined'**:
   - Asegúrate de inicializar las propiedades en el constructor o mediante declaración
   - Usa condiciones explícitas en los templates con `*ngIf`
   - Considera usar operadores de aserción de tipos cuando sea seguro (`!` o `as`)

2. **Error de Bootstrap**:
   - Verifica que Bootstrap esté correctamente instalado y configurado en angular.json

## Nota sobre Angular 18

Este proyecto utiliza Angular 18, que implementa un nuevo enfoque basado en componentes independientes (standalone). Los archivos principales están estructurados de la siguiente manera:

- `src/main.ts` - Punto de entrada principal con proveedores
- `src/app/app.routes.ts` - Configuración de rutas
- Componentes independientes (no utilizan módulos)

## Características implementadas

- Consumo de la API de Star Wars (SWAPI)
- Persistencia de datos en MariaDB usando Sequelize
- Relación muchos a muchos entre personajes y naves
- Interfaz de usuario responsive con Bootstrap
- Alertas mejoradas con SweetAlert2
- Patrones de diseño como Repositorio y Servicio
- Borrado lógico de entidades

## Mejoras potenciales

- Implementación de pruebas unitarias
- Paginación en el backend y frontend
- Filtros de búsqueda
- Sistema de autenticación
- Implementación de migraciones formales en lugar de sincronización
