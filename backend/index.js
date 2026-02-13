require("dotenv").config();
const express = require("express");
const cors = require("cors");

require("./mongo-connection");

const usersRouter = require("./routes/users");
const restaurantsRouter = require("./routes/restaurants");
const orderRouter = require("./routes/orders");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", usersRouter);
app.use("/restaurants", restaurantsRouter);
app.use("/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("Food Order API is running.");
});

app.use((err, req, res, next) => {
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started listening on port ${port}`);
});

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  credentials: true,
};
app.use(cors(corsOptions));

module.exports = app;
