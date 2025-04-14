const mongoose = require("mongoose");

// Category Schema
const CategorySchema = new mongoose.Schema({
  CateID: { type: String, required: true, unique: true },
  CateName: { type: String, required: true },
});

// Tạo và xuất model
module.exports = mongoose.model("Category", CategorySchema);
