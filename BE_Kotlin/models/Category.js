const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Category Schema
const CategorySchema = new Schema({
  CateName: { type: String, required: true },
}, { timestamps: true });

// Tạo và xuất model
module.exports = mongoose.model("Category", CategorySchema);
