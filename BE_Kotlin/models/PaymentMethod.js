const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// PaymentMethod Schema
const PaymentMethodSchema = new Schema(
  {
    MethodName: { type: String, required: true },
  },
  { timestamps: true }
);

// Tạo và xuất model
module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);
