const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Cart Schema
const CartSchema = new Schema(
  {
    CartID: {
      type: String,
      unique: true,
      default: function () {
        // Generate a unique ID based on timestamp and random number
        return (
          "CART_" +
          Date.now().toString() +
          Math.floor(Math.random() * 1000).toString()
        );
      },
    },
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
