const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Category Schema
const CategorySchema = new Schema({
  CateID: {
    type: String,
    required: true,
    unique: true,
  },
  CateName: { type: String, required: true },
});

// Tạo và xuất model
module.exports = mongoose.model("Category", CategorySchema);
