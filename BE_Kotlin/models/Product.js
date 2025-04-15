const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Product Schema
const ProductSchema = new Schema(
  {
    ProductID: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null nhưng không cho phép trùng lặp khi có giá trị
    },
    CateID: {
      type: String,
      ref: "Category",
      required: true,
    }, // FK
    ProductName: { type: String, required: true },
    Description: { type: String },
    Price: { type: Number, required: true },
    Image: { type: String }, // You might want to use a more complex type if needed
  },
  { timestamps: true }
);

// Tạo và xuất model
module.exports = mongoose.model("Product", ProductSchema);
