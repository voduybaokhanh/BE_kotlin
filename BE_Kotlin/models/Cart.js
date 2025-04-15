const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Cart Schema
const CartSchema = new Schema(
  {
    CartID: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null nhưng không cho phép trùng lặp khi có giá trị
    },
    Email: {
      type: String,
      ref: "Account",
      required: true,
    }, // FK
  },
  { timestamps: true }
);

// Tạo và xuất model
module.exports = mongoose.model("Cart", CartSchema);
