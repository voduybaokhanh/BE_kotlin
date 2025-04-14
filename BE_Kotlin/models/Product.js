const mongoose = require("mongoose");

// Product Schema
const ProductSchema = new mongoose.Schema({
  ProductID: { type: String, required: true, unique: true },
  CateID: { type: String, ref: "Category", required: true }, // FK
  ProductName: { type: String, required: true },
  Description: { type: String },
  Price: { type: Number, required: true },
  Image: { type: String }, // You might want to use a more complex type if needed
});

// Tạo và xuất model
module.exports = mongoose.model("Product", ProductSchema);
