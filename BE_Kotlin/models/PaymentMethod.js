const mongoose = require("mongoose");

// PaymentMethod Schema
const PaymentMethodSchema = new mongoose.Schema({
  PaymentMethodID: { type: String, required: true, unique: true }, // PK
  MethodName: { type: String, required: true },
});

// Tạo và xuất model
module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);
