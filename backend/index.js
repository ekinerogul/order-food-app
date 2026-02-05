const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const usersRouter = require("./routes/users");
const restaurantsRouter = require("./routes/restaurants");
const orderRouter = require("./routes/orders");

require("./mongo-connection");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.set("view engine", "pug");

app.use("/users", usersRouter);
app.use("/restaurants", restaurantsRouter);
app.use("/orders", orderRouter);

// Global error handler: next(err) cagirilan hatalari yakalayip 500 donmesi icin ve test kullanimi icin eklendi.

app.use((err, req, res, next) => {
  res.status(500).send("Internal Server Error");
});

module.exports = app;
