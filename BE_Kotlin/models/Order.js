const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Order Schema
const OrderSchema = new Schema({
  OrderID: {
    type: String,
    required: true,
    unique: true,
  }, // PK
  Email: {
    type: String,
    ref: "Account",
    required: true,
  }, // FK
  Address: {
    type: String,
    ref: "Address",
    required: true,
  }, // FK
  PaymentMethod: {
    type: String,
    ref: "PaymentMethod",
    required: true,
  }, // FK
  OrderDate: { type: Date, default: Date.now },
  Status: { type: String, default: "Pending" }, // e.g., Pending, Processing, Shipped, Delivered
});

// Tạo và xuất model
module.exports = mongoose.model("Order", OrderSchema);
