const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// OrderItem Schema
const OrderItemSchema = new Schema({
  OrderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  }, // PK, FK1
  ProductID: {
    type: String,
    ref: "Product",
    required: true,
  }, // PK, FK2
  Quantity: { type: Number, required: true },
  Price: { type: Number, required: true }, // You might want to store the price at the time of order
});

// Tạo composite key
OrderItemSchema.index({ OrderID: 1, ProductID: 1 }, { unique: true });

// Tạo và xuất model
module.exports = mongoose.model("OrderItem", OrderItemSchema);
