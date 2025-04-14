const mongoose = require("mongoose");

// OrderItem Schema
const OrderItemSchema = new mongoose.Schema({
  OrderID: { type: String, ref: "Order", required: true }, // PK, FK1
  ProductID: { type: String, ref: "Product", required: true }, // PK, FK2
  Quantity: { type: Number, required: true },
  Price: { type: Number, required: true }, // You might want to store the price at the time of order
});

// Tạo composite key
OrderItemSchema.index({ OrderID: 1, ProductID: 1 }, { unique: true });

// Tạo và xuất model
module.exports = mongoose.model("OrderItem", OrderItemSchema);
