const mongoose = require("mongoose");
require("dotenv").config();

// Chuỗi kết nối MongoDB
// Sử dụng biến môi trường nếu có, nếu không sử dụng chuỗi kết nối cứng
const mongoURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://khanhvo908:0774749399@cluster0.g5qbg.mongodb.net/Kotlin";

// Thiết lập kết nối với các tùy chọn tối ưu
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      // Các tùy chọn kết nối đã được mặc định trong Mongoose 6+
      // Không cần chỉ định useNewUrlParser, useUnifiedTopology, etc.
    });

    // Thêm sự kiện để theo dõi kết nối
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    // Xử lý khi ứng dụng đóng
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Thoát quá trình với lỗi
    process.exit(1);
  }
};

module.exports = connectDB;
