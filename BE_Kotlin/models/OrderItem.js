const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// OrderItem Schema
const OrderItemSchema = new Schema(
  {
    OrderItemID: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null nhưng không cho phép trùng lặp khi có giá trị
    },
    OrderID: {
      type: String,
      ref: "Order",
      required: true,
    }, // FK1
    ProductID: {
      type: String,
      ref: "Product",
      required: true,
    }, // FK2
    Quantity: { type: Number, required: true },
    Price: { type: Number, required: true }, // You might want to store the price at the time of order
  },
  { timestamps: true }
);

// Tạo composite key
OrderItemSchema.index({ OrderID: 1, ProductID: 1 }, { unique: true });

// Tạo và xuất model
module.exports = mongoose.model("OrderItem", OrderItemSchema);
