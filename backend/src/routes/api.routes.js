const express = require("express");
const personController = require("../controllers/person.controller");

const router = express.Router();

// Rutas para personajes
router.get("/persons", personController.getAllPersons);
//router.get("/persons/:id", personController.getPersonById);
router.get("/persons/:id/ships", personController.getPersonShips);
router.delete("/persons/:id", personController.deletePerson);

// Ruta para inicializar datos desde SWAPI
router.post("/initialize", personController.initializeData);

module.exports = router;
