const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Product Schema
const ProductSchema = new Schema({
  ProductID: { 
    type: String, 
    required: true, 
    unique: true 
  },
  CateID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category", 
    required: true 
  }, // FK
  ProductName: { type: String, required: true },
  Description: { type: String },
  Price: { type: Number, required: true },
  Image: { type: String }, // You might want to use a more complex type if needed
});

// Tạo và xuất model
module.exports = mongoose.model("Product", ProductSchema);
