const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    age: { type: Number, required: true, min: 18 },
    addresses: [
      {
        street: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        autopopulate: { maxDepth: 2 },
      },
    ],
  },
  { timestamps: true },
);

UserSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("User", UserSchema);
