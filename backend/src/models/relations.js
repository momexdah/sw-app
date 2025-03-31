const Person = require("./person.model");
const Starship = require("./starship.model");

// Crear la relación muchos a muchos
const PersonStarship = Person.belongsToMany(Starship, {
  through: "PersonStarships",
  as: "starships",
});

const StarshipPerson = Starship.belongsToMany(Person, {
  through: "PersonStarships",
  as: "pilots",
});

module.exports = {
  Person,
  Starship,
  PersonStarship,
  StarshipPerson,
};
