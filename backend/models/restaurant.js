const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  ownerName: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: String,
  },
  workingHours: {
    open: { type: String, default: "09.00" },
    close: { type: String, default: "22.00" },
  },
  menu: [
    {
      food: {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 10 },
        category: { type: String, default: "General" },
      },
    },
  ],
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
