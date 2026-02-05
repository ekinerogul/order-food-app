const { userService, orderService } = require("../services");

const router = require("express").Router();

router.post("/register", async (req, res, next) => {
  console.log("Register route hit!");
  try {
    const { email, password, name, age } = req.body;
    const user = await userService.register(email, password, name, age);
    res.send(user);
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    res.send(user);
  } catch (e) {
    next(e);
  }
});

router.get("/young-users", async (req, res) => {
  const users = await userService.findYoungUsers();

  res.render("users", { users });
});

router.get("/", async (req, res) => {
  res.send(await userService.load());
});

router.post("/", async (req, res, next) => {
  try {
    const user = await userService.insert(req.body);
    res.send(user);
  } catch (e) {
    next(e);
  }
});

router.delete("/:userId", async (req, res) => {
  await userService.removeBy("_id", req.params.userId);
  res.send("OK");
});

router.get("/:userId", async (req, res) => {
  const user = await userService.find(req.params.userId);

  if (!user) return res.status(404).send("Cannot find user");
  res.send(user);
});

router.post("/:userId/orders", async (req, res) => {
  const { userId } = req.params;
  const { restaurantId, items, address } = req.body;

  const order = await orderService.order(restaurantId, userId, items, address);

  res.send(order);
});

router.post("/:userId/addresses", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const address = req.body;
    const user = await userService.addAddress(userId, address);
    res.send(user);
  } catch (e) {
    next(e);
  }
});

router.patch("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { name } = req.body;

  await userService.update(userId, { name });
  res.send("OK");
});

module.exports = router;
