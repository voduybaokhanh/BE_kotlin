const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Category Schema
const CategorySchema = new Schema(
  {
    CateID: {
      type: String,
      unique: true,
      default: function () {
        // Generate a unique ID based on timestamp and random number
        return (
          Date.now().toString() + Math.floor(Math.random() * 1000).toString()
        );
      },
    },
    CateName: { type: String, required: true },
  },
  { timestamps: true }
);

// Tạo và xuất model
module.exports = mongoose.model("Category", CategorySchema);
