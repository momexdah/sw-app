const { Starship, Person } = require("../models/relations");

class StarshipRepository {
  async save(starshipData) {
    try {
      const [starship, created] = await Starship.findOrCreate({
        where: { swapiId: starshipData.swapiId },
        defaults: starshipData,
      });

      if (!created) {
        await starship.update(starshipData);
      }

      return starship;
    } catch (error) {
      console.error("Error al guardar nave:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      return await Starship.findByPk(id, {
        where: { isDeleted: false },
        include: [
          {
            model: Person,
            as: "pilots",
            through: { attributes: [] },
          },
        ],
      });
    } catch (error) {
      console.error("Error al obtener nave por ID:", error);
      throw error;
    }
  }

  async getAll() {
    try {
      return await Starship.findAll({
        where: { isDeleted: false },
      });
    } catch (error) {
      console.error("Error al obtener todas las naves:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const starship = await Starship.findByPk(id);
      if (!starship) {
        throw new Error("Nave no encontrada");
      }

      // Borrado lógico
      return await starship.update({ isDeleted: true });
    } catch (error) {
      console.error("Error al eliminar nave:", error);
      throw error;
    }
  }
}

module.exports = new StarshipRepository();
