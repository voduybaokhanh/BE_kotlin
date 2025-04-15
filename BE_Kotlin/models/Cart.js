const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Cart Schema
const CartSchema = new Schema(
  {
    Email: {
      type: String,
      ref: "Account",
      required: true,
    }, // FK
  },
  { timestamps: true }
);

// Tạo và xuất model
module.exports = mongoose.model("Cart", CartSchema);
