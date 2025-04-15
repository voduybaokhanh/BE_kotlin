const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Address Schema
const AddressSchema = new Schema(
  {
    AddressID: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null nhưng không cho phép trùng lặp khi có giá trị
    },
    Email: {
      type: String,
      ref: "Account",
      required: true,
    }, // FK
    Street: { type: String, required: true },
    City: { type: String, required: true },
    Country: { type: String, required: true },
  },
  { timestamps: true }
);

// Tạo và xuất model
module.exports = mongoose.model("Address", AddressSchema);
