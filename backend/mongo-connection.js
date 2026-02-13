const mongoose = require("mongoose");

const connectionString =
  process.env.MONGODB_CONNECTION_STRING || "mongodb://localhost:27017/projectz";

const connectDB = async () => {
  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Connected to MongoDB via", connectionString);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

connectDB();

module.exports = mongoose;
