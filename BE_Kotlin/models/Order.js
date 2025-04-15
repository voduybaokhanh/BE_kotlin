const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Order Schema
const OrderSchema = new Schema(
  {
    Address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    }, // FK
    PaymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    }, // FK
    OrderDate: { type: Date, default: Date.now },
    Status: { type: mongoose.Schema.Types.ObjectId, default: "Pending" }, // e.g., Pending, Processing, Shipped, Delivered
  },
  { timestamps: true }
);

// Tạo và xuất model
module.exports = mongoose.model("Order", OrderSchema);
