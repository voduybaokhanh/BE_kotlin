const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Account Schema
const AccountSchema = new Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
  }, // PK
  FullName: { type: String, required: true },
  Password: { type: String, required: true },
});

// Tạo và xuất model
module.exports = mongoose.model("Account", AccountSchema);
