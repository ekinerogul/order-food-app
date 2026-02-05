const { restaurantService } = require("../services");

const router = require("express").Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, ownerName, address } = req.body;
    const restaurant = await restaurantService.register(
      email,
      password,
      name,
      ownerName,
      address,
    );
    res.send(restaurant);
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const restaurant = await restaurantService.login(email, password);
    res.send(restaurant);
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res) => {
  const restaurants = await restaurantService.load();
  res.send(restaurants);
});

router.post("/", async (req, res, next) => {
  try {
    const restaurant = await restaurantService.insert(req.body);
    res.send(restaurant);
  } catch (e) {
    next(e);
  }
});

router.delete("/:restaurantId", async (req, res) => {
  await restaurantService.removeBy("_id", req.params.restaurantId);
  res.send("OK");
});

router.get("/:restaurantId", async (req, res) => {
  const restaurant = await restaurantService.find(req.params.restaurantId);
  if (!restaurant) return res.status(404).send("Cannot find restaurant");
  res.send(restaurant);
});

router.patch("/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  const { name } = req.body;

  await restaurantService.update(restaurantId, { name });

  res.send("OK");
});

router.patch("/:restaurantId/menu", async (req, res) => {
  const { restaurantId } = req.params;
  const { name, price, category } = req.body;

  const restaurant = await restaurantService.addFood(
    restaurantId,
    name,
    price,
    category,
  );
  res.send(restaurant);
});

module.exports = router;
