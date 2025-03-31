const { Person, Starship } = require("../models/relations");

class PersonRepository {
  async save(personData) {
    try {
      const [person, created] = await Person.findOrCreate({
        where: { swapiId: personData.swapiId },
        defaults: personData,
      });

      if (!created) {
        await person.update(personData);
      }

      return person;
    } catch (error) {
      console.error("Error al guardar persona:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      return await Person.findOne({
        where: { 
          id: id,
          isDeleted: false 
        },
        include: [
          {
            model: Starship,
            as: "starships",
            through: { attributes: [] },
          },
        ],
      });
    } catch (error) {
      console.error("Error al obtener persona por ID:", error);
      throw error;
    }
  }
  async getAll() {
    try {
      return await Person.findAll({
        where: { isDeleted: false },
      });
    } catch (error) {
      console.error("Error al obtener todas las personas:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const person = await Person.findByPk(id);
      if (!person) {
        throw new Error("Persona no encontrada");
      }

      // Borrado lógico
      return await person.update({ isDeleted: true });
    } catch (error) {
      console.error("Error al eliminar persona:", error);
      throw error;
    }
  }

  async addStarshipToPerson(personId, starshipId) {
    try {
      const person = await Person.findByPk(personId);
      const starship = await Starship.findByPk(starshipId);

      if (!person || !starship) {
        throw new Error("Persona o nave no encontrada");
      }

      await person.addStarship(starship);
      return { success: true };
    } catch (error) {
      console.error("Error al asociar nave a persona:", error);
      throw error;
    }
  }
}

module.exports = new PersonRepository();
