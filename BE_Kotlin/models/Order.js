const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Order Schema
const OrderSchema = new Schema(
  {
    OrderID: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null nhưng không cho phép trùng lặp khi có giá trị
    },
    AddressID: {
      type: String,
      ref: "Address",
      required: true,
    }, // FK
    PaymentMethodID: {
      type: String,
      ref: "PaymentMethod",
      required: true,
    }, // FK
    OrderDate: { type: Date, default: Date.now },
    Status: { type: String, default: "Pending" }, // e.g., Pending, Processing, Shipped, Delivered
  },
  { timestamps: true }
);

// Tạo và xuất model
module.exports = mongoose.model("Order", OrderSchema);
