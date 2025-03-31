const axios = require("axios");
const personRepository = require("../repositories/person.repository");
const starshipRepository = require("../repositories/starship.repository");

const BASE_URL = "https://swapi.dev/api";

class SwapiService {
  // Obtiene los personajes de la API y los guarda en la base de datos
  async fetchAndSavePersons() {
    try {
      const response = await axios.get(`${BASE_URL}/people/`);
      const persons = response.data.results;

      const savedPersons = [];

      for (const person of persons) {
        // Extraer el ID del URL del API
        const swapiId = person.url.split("/").filter(Boolean).pop();

        // Guardar el personaje
        const savedPerson = await personRepository.save({
          name: person.name,
          height: person.height,
          mass: person.mass,
          swapiId,
        });

        // Procesar y guardar las naves asociadas al personaje
        if (person.starships && person.starships.length > 0) {
          await this.processPersonStarships(savedPerson, person.starships);
        }

        savedPersons.push(savedPerson);
      }

      return savedPersons;
    } catch (error) {
      console.error("Error al obtener y guardar personas:", error);
      throw error;
    }
  }

  // Procesa y guarda las naves de un personaje
  async processPersonStarships(person, starshipUrls) {
    try {
      for (const starshipUrl of starshipUrls) {
        // Obtener detalles de la nave
        const starshipData = await this.fetchStarshipDetails(starshipUrl);

        if (starshipData) {
          // Guardar la nave
          const savedStarship = await starshipRepository.save(starshipData);

          // Asociar la nave al personaje
          await personRepository.addStarshipToPerson(
            person.id,
            savedStarship.id
          );
        }
      }
    } catch (error) {
      console.error("Error al procesar naves de persona:", error);
      throw error;
    }
  }

  // Obtiene los detalles de una nave específica
  async fetchStarshipDetails(starshipUrl) {
    try {
      const response = await axios.get(starshipUrl);
      const starship = response.data;

      // Extraer el ID del URL
      const swapiId = starship.url.split("/").filter(Boolean).pop();

      return {
        name: starship.name,
        model: starship.model,
        swapiId,
      };
    } catch (error) {
      console.error(
        `Error al obtener detalles de nave (${starshipUrl}):`,
        error
      );
      return null;
    }
  }
}

module.exports = new SwapiService();
