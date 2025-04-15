const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Product Schema
const ProductSchema = new Schema(
  {
    // Add ID field with unique constraint and default value generator
    ID: {
      type: String,
      unique: true,
      default: function () {
        // Generate a unique ID based on timestamp and random number
        return (
          "ID_" +
          Date.now().toString() +
          Math.floor(Math.random() * 1000).toString()
        );
      },
    },
    ProductID: {
      type: String,
      unique: true,
      default: function () {
        // Generate a unique ID based on timestamp and random number
        return (
          "PROD_" +
          Date.now().toString() +
          Math.floor(Math.random() * 1000).toString()
        );
      },
    },
    ProductID: {
      type: String,
      unique: true,
      default: function () {
        // Generate a unique ID based on timestamp and random number
        return (
          "PROD_" +
          Date.now().toString() +
          Math.floor(Math.random() * 1000).toString()
        );
      },
    },
    CateID: {
      type: mongoose.Schema.Types.ObjectId,
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
