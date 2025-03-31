const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./config/index");
const { Person, Starship } = require("./models/relations");
const apiRoutes = require("./routes/api.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", apiRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API Star Wars funcionando correctamente" });
});

// Sincronizar modelos con la base de datos
async function initializeDatabase() {
  try {
    // Sincronizar modelos
    await sequelize.sync({ force: true }); // En producción usar { force: false }
    console.log("Base de datos sincronizada correctamente");
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  }
}

// Iniciar el servidor
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  await initializeDatabase();
});
