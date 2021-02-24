const {
  models: { BuildYourOwn, Restaurant, Pizza, Unique_pizza },
} = require("../db/db");
const router = require("express").Router();

router.get("/pizza", async (req, res, next) => {
  try {
    res.send(await Pizza.findAll());
  } catch (err) {
    next(err);
  }
});

router.get("/restaurant", async (req, res, next) => {
  try {
    res.send(await Restaurant.findAll({ include: Pizza }));
  } catch (err) {
    next(err);
  }
});

router.get("/restaurant/:id", async (req, res, next) => {
  try {
    res.send(
      await Restaurant.findByPk(req.params.id, {
        include: Pizza,
      })
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
