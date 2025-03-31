const personRepository = require("../repositories/person.repository");
const swapiService = require("../services/swapi.service");

class PersonController {
  // Obtener todos los personajes
  async getAllPersons(req, res) {
    try {
      const persons = await personRepository.getAll();
      return res.status(200).json(persons);
    } catch (error) {
      console.error("Error al obtener personas:", error);
      return res.status(500).json({ error: "Error al obtener personas" });
    }
  }

  // Obtener un personaje por ID
  async getPersonById(req, res) {
    try {
      const id = req.params.id;
      const person = await personRepository.getById(id);

      if (!person) {
        return res.status(404).json({ error: "Persona no encontrada" });
      }

      return res.status(200).json(person);
    } catch (error) {
      console.error("Error al obtener persona por ID:", error);
      return res.status(500).json({ error: "Error al obtener persona" });
    }
  }

  // Obtener naves de un personaje
  async getPersonShips(req, res) {
    try {
      const id = req.params.id;
      const person = await personRepository.getById(id);

      if (!person) {
        return res.status(404).json({ error: "Persona no encontrada" });
      }

      return res.status(200).json(person.starships || []);
    } catch (error) {
      console.error("Error al obtener naves de persona:", error);
      return res.status(500).json({ error: "Error al obtener naves" });
    }
  }

  // Eliminar un personaje (borrado lógico)
  async deletePerson(req, res) {
    try {
      const id = req.params.id;
      await personRepository.delete(id);
      return res
        .status(200)
        .json({ message: "Persona eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar persona:", error);
      return res.status(500).json({ error: "Error al eliminar persona" });
    }
  }

  // Inicializar datos desde la API de Star Wars
  async initializeData(req, res) {
    try {
      const persons = await swapiService.fetchAndSavePersons();
      return res.status(200).json({
        message: "Datos inicializados correctamente",
        count: persons.length,
      });
    } catch (error) {
      console.error("Error al inicializar datos:", error);
      return res.status(500).json({ error: "Error al inicializar datos" });
    }
  }
}

module.exports = new PersonController();
