const mongoose = require("mongoose");

// Account Schema
const AccountSchema = new mongoose.Schema({
  Email: { type: String, required: true, unique: true }, // PK
  FullName: { type: String, required: true },
  Password: { type: String, required: true },
});

// Tạo và xuất model
module.exports = mongoose.model("Account", AccountSchema);
