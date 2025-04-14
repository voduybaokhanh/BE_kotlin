const mongoose = require("mongoose");

// CartItem Schema
const CartItemSchema = new mongoose.Schema({
  CartID: { type: String, ref: "Cart", required: true }, // PK, FK1
  ProductID: { type: String, ref: "Product", required: true }, // PK, FK2
  Quantity: { type: Number, required: true, default: 1 },
});

// Tạo composite key
CartItemSchema.index({ CartID: 1, ProductID: 1 }, { unique: true });

// Tạo và xuất model
module.exports = mongoose.model("CartItem", CartItemSchema);
