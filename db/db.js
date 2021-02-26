const { Sequelize, DataTypes, Model } = require("sequelize");
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/nyc_pizza"
);

class BuildYourOwn extends Model {}
BuildYourOwn.init({}, { sequelize: db, modelName: "build_your_own" });

class Restaurant extends Model {}
Restaurant.init(
  {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      // defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    neighborhood: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    waitservice: DataTypes.BOOLEAN,
    slice: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    year_opened: DataTypes.DATE,
    URL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "restaurant" }
);

class Pizza extends Model {}
Pizza.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    delicious: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { sequelize: db, modelName: "pizza" }
);

class Unique_pizza extends Model {}
Unique_pizza.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    unique_name: DataTypes.STRING,
  },
  { sequelize: db, modelName: "unique_pizza" }
);

Pizza.belongsToMany(Pizza, {
  foreignKey: "baseId",
  as: "toppings",
  through: BuildYourOwn,
});
Pizza.belongsToMany(Pizza, {
  foreignKey: "toppingsId",
  as: "base",
  through: BuildYourOwn,
});
Pizza.belongsToMany(Restaurant, { through: Unique_pizza });
Restaurant.belongsToMany(Pizza, { through: Unique_pizza });

const restaurants = [
  {
    id: "salandcarmine",
    name: "Sal and Carmine",
    neighborhood: "UWS",
    waitservice: false,
    year_opened: 1959,
    URL: "https://www.salandcarminepizza.com/",
  },
  {
    id: "joes",
    name: "Joes",
    neighborhood: "Greenwich Village",
    waitservice: false,
    year_opened: 1975,
    URL: "http://www.joespizzanyc.com/",
  },
  {
    id: "pauliegees",
    name: "Paulie Gee's",
    neighborhood: "Greenpoint",
    waitservice: true,
    year_opened: 2010,
    URL: "https://pauliegee.com/",
  },
  {
    id: "rubirosa",
    name: "Rubirosa",
    neighborhood: "Nolita",
    waitservice: true,
    slice: false,
    year_opened: 2010,
    URL: "https://www.rubirosanyc.com/",
  },
  {
    id: "bestpizza",
    name: "Best Pizza",
    neighborhood: "Williamsburg",
    waitservice: false,
    slice: false,
    year_opened: 2010,
    URL: "https://www.bestpizzawilliamsburg.com/",
  },
  {
    id: "landb",
    name: "L & B Spumoni Gardens",
    neighborhood: "Bensonhurst",
    waitservice: true,
    year_opened: 1939,
    URL: "https://spumonigardens.com/",
  },
  {
    id: "luigis",
    name: "Luigis",
    neighborhood: "South Slope",
    waitservice: false,
    year_opened: 1973,
    URL: "http://luigispizzabrooklyn.com/",
  },
];
const pizzas = [
  { name: "Cheese" },
  { name: "Vodka" },
  { name: "Salad" },
  { name: "Pepperoni" },
  { name: "Upside-down Sicilian" },
  { name: "Honey" },
  { name: "Ham and Pineapple", delicious: false },
  { name: "Seasonal Vegetables" },
  { name: "Margherita" },
];

const syncAndSeed = async () => {
  await db.sync({ force: true });
  const [
    salAndCarmine,
    joes,
    paulieGee,
    rubirosa,
    bestPizza,
    LB,
    Luigi,
  ] = await Promise.all(
    restaurants.map(
      ({ id, name, neighborhood, waitservice, slice, year_opened, URL }) =>
        Restaurant.create({
          id,
          name,
          neighborhood,
          waitservice,
          slice,
          year_opened,
          URL,
        })
    )
  );
  const [
    cheese,
    vodka,
    salad,
    pepperoni,
    sicillian,
    honey,
    hamAndPineapple,
    seasonalVeg,
    margherita,
  ] = await Promise.all(
    pizzas.map(({ name, delicious }) =>
      Pizza.create({
        name: name,
        delicious: delicious,
      })
    )
  );
  const pizzaAvailibility = [
    {
      pizzaId: cheese.id,
      restaurantId: salAndCarmine.id,
    },
    {
      pizzaId: margherita.id,
      restaurantId: salAndCarmine.id,
    },
    {
      pizzaId: pepperoni.id,
      restaurantId: salAndCarmine.id,
    },
    {
      pizzaId: pepperoni.id,
      restaurantId: joes.id,
    },
    {
      pizzaId: cheese.id,
      restaurantId: joes.id,
    },
    {
      pizzaId: margherita.id,
      restaurantId: joes.id,
    },
    {
      pizzaId: sicillian.id,
      restaurantId: joes.id,
    },
    {
      unique_name: "Porkypineapple",
      pizzaId: hamAndPineapple.id,
      restaurantId: paulieGee.id,
    },
    {
      unique_name: "Greenpointer",
      pizzaId: salad.id,
      restaurantId: paulieGee.id,
    },
    {
      unique_name: "Regina",
      pizzaId: margherita.id,
      restaurantId: paulieGee.id,
    },
    {
      unique_name: "Hellboy",
      pizzaId: honey.id,
      restaurantId: paulieGee.id,
    },
    {
      pizzaId: vodka.id,
      restaurantId: rubirosa.id,
    },
    {
      unique_name: "Fresca",
      pizzaId: margherita.id,
      restaurantId: rubirosa.id,
    },
    {
      pizzaId: cheese.id,
      restaurantId: rubirosa.id,
    },
    {
      unique_name: "Honey Pie",
      pizzaId: honey.id,
      restaurantId: rubirosa.id,
    },
    {
      pizzaId: salad.id,
      restaurantId: rubirosa.id,
    },
    {
      pizzaId: pepperoni.id,
      restaurantId: rubirosa.id,
    },
    {
      pizzaId: pepperoni.id,
      restaurantId: bestPizza.id,
    },
    {
      pizzaId: cheese.id,
      restaurantId: bestPizza.id,
    },
    {
      pizzaId: seasonalVeg.id,
      restaurantId: bestPizza.id,
    },
    {
      pizzaId: sicillian.id,
      restaurantId: LB.id,
    },
    {
      pizzaId: pepperoni.id,
      restaurantId: LB.id,
    },
    {
      pizzaId: cheese.id,
      restaurantId: Luigi.id,
    },
    {
      pizzaId: pepperoni.id,
      restaurantId: Luigi.id,
    },
    {
      pizzaId: vodka.id,
      restaurantId: Luigi.id,
    },
    {
      pizzaId: margherita.id,
      restaurantId: Luigi.id,
    },
  ];

  await Promise.all(
    pizzaAvailibility.map(({ unique_name, pizzaId, restaurantId }) =>
      Unique_pizza.create({
        unique_name: unique_name,
        pizzaId: pizzaId,
        restaurantId: restaurantId,
      })
    )
  );
  const baseToppings = [
    {
      baseId: cheese.id,
      toppingsId: pepperoni.id,
    },
    {
      baseId: cheese.id,
      toppingsId: salad.id,
    },
    {
      baseId: cheese.id,
      toppingsId: honey.id,
    },
    {
      baseId: cheese.id,
      toppingsId: hamAndPineapple.id,
    },
    {
      baseId: cheese.id,
      toppingsId: seasonalVeg.id,
    },
    {
      baseId: vodka.id,
      toppingsId: pepperoni.id,
    },
    {
      baseId: vodka.id,
      toppingsId: salad.id,
    },
    {
      baseId: vodka.id,
      toppingsId: honey.id,
    },
    {
      baseId: sicillian.id,
      toppingsId: pepperoni.id,
    },
    {
      baseId: margherita.id,
      toppingsId: pepperoni.id,
    },
    {
      baseId: salad.id,
      toppingsId: pepperoni.id,
    },
  ];
  await Promise.all(
    baseToppings.map(({ baseId, toppingsId }) =>
      BuildYourOwn.create({
        baseId: baseId,
        toppingsId: toppingsId,
      })
    )
  );
};

module.exports = {
  syncAndSeed,
  models: { BuildYourOwn, Restaurant, Pizza, Unique_pizza },
};
