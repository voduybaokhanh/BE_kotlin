const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Category Schema
const CategorySchema = new Schema(
  {
    CateID: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null nhưng không cho phép trùng lặp khi có giá trị
    },
    CateName: { type: String, required: true },
  },
  { timestamps: true }
);

// Tạo và xuất model
module.exports = mongoose.model("Category", CategorySchema);
