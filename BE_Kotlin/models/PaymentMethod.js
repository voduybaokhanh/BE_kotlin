const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// PaymentMethod Schema
const PaymentMethodSchema = new Schema(
  {
    PaymentMethodID: { 
      type: String, 
      unique: true,
      sparse: true, // Cho phép null nhưng không cho phép trùng lặp khi có giá trị
    },
    MethodName: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// Tạo và xuất model
module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);
