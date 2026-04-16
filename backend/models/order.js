const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      autopopulate: { maxDepth: 1 },
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      autopopulate: { maxDepth: 1 },
      required: true,
    },
    items: [
      {
        foodName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    totalPrice: { type: Number, required: true },
    address: {
      addressId: { type: mongoose.Schema.Types.ObjectId, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      details: { type: String },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "delivered", "cancelled"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

OrderSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Order", OrderSchema);
