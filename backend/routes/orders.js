const { orderService } = require("../services");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const orders = await orderService.load();
  res.send(orders);
});

router.get("/search", async (req, res) => {
  const { foodName, city, status } = req.query;

  const query = {};

  if (foodName) query["items.foodName"] = foodName;
  if (city) query["address.city"] = city;
  if (status) query.status = status;

  const orders = await orderService.query(query);
  res.send(orders);
});

module.exports = router;
