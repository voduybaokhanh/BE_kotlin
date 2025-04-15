const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CartItem Schema
const CartItemSchema = new Schema(
  {
    CartID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    }, // FK1
    ProductID: {
      type: mongoose.Schema.Types.ObjectId,
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
