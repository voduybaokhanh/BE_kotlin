const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Address Schema
const AddressSchema = new Schema({
  AddressID: {
    type: String,
    required: true,
    unique: true,
  }, // PK
  Email: {
    type: String,
    ref: "Account",
    required: true,
  }, // FK
  Street: { type: String, required: true },
  City: { type: String, required: true },
  Country: { type: String, required: true },
});

// Tạo và xuất model
module.exports = mongoose.model("Address", AddressSchema);
