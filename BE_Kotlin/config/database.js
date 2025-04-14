const mongoose = require("mongoose");

// Chuỗi kết nối MongoDB
// Thay đổi URI này theo cấu hình MongoDB của bạn
const mongoURI =
  "mongodb+srv://khanhvo908:0774749399@cluster0.g5qbg.mongodb.net/Kotlin";

// Thiết lập kết nối
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Thoát quá trình với lỗi
    process.exit(1);
  }
};

module.exports = connectDB;
