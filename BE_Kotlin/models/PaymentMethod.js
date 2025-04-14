const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// PaymentMethod Schema
const PaymentMethodSchema = new Schema({
  PaymentMethodID: { 
    type: String, 
    required: true, 
    unique: true 
  }, // PK
  MethodName: { type: String, required: true },
});

// Tạo và xuất model
module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);
