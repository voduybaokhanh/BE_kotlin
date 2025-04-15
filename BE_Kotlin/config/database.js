const mongoose = require("mongoose");
require("dotenv").config();

// Chuỗi kết nối MongoDB
// Sử dụng biến môi trường DATABASE_URL
const mongoURI = process.env.DATABASE_URL;

// Thiết lập kết nối với các tùy chọn tối ưu
const connectDB = async () => {
  try {
    if (!mongoURI) {
      throw new Error('DATABASE_URL không được cấu hình trong biến môi trường');
    }

    await mongoose.connect(mongoURI, {
      // Mongoose 6+ đã mặc định các tùy chọn tối ưu
      // Thêm các tùy chọn nâng cao nếu cần
      serverSelectionTimeoutMS: 5000, // Timeout sau 5s nếu không thể kết nối
      heartbeatFrequencyMS: 30000,    // Kiểm tra kết nối mỗi 30s
      maxPoolSize: 10,                // Giới hạn số lượng kết nối đồng thời
    });

    // Thêm sự kiện để theo dõi kết nối
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB kết nối thành công");
    });

    mongoose.connection.on("error", (err) => {
      console.error(`❌ Lỗi kết nối MongoDB: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB đã ngắt kết nối");
    });

    // Xử lý khi ứng dụng đóng
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB đóng kết nối do ứng dụng kết thúc");
      process.exit(0);
    });

    // Xử lý các sự kiện không xử lý được
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Không thoát ứng dụng, chỉ ghi log
    });
  } catch (error) {
    console.error("❌ Kết nối MongoDB thất bại:", error.message);
    // Thoát quá trình với lỗi sau 3 giây để ghi log
    setTimeout(() => process.exit(1), 3000);
  }
};

module.exports = connectDB;
