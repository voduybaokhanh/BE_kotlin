const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CartItem Schema
const CartItemSchema = new Schema(
  {
    CartID: {
      type: String,
      ref: "Cart",
      required: true,
    }, // FK1
    ProductID: {
      type: String,
      ref: "Product",
      required: true,
    }, // FK2
    Quantity: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

// Tạo composite key
CartItemSchema.index({ CartID: 1, ProductID: 1 }, { unique: true });

// Tạo và xuất model
module.exports = mongoose.model("CartItem", CartItemSchema);
