const mongoose = require("mongoose");

// Cart Schema
const CartSchema = new mongoose.Schema({
  CartID: { type: String, required: true, unique: true }, //PK
  Email: { type: String, ref: "Account", required: true }, // FK
});

// Tạo và xuất model
module.exports = mongoose.model("Cart", CartSchema);
