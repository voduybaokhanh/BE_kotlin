const mongoose = require("mongoose");
require("dotenv").config();

// Chuỗi kết nối MongoDB
// Sử dụng biến môi trường DATABASE_URL
const mongoURI = process.env.DATABASE_URL;

// Thiết lập kết nối với các tùy chọn tối ưu
const connectDB = async () => {
  try {
    if (!mongoURI) {
      throw new Error("DATABASE_URL không được cấu hình trong biến môi trường");
    }

    await mongoose.connect(mongoURI, {
      // Mongoose 6+ đã mặc định các tùy chọn tối ưu
      // Thêm các tùy chọn nâng cao nếu cần
      serverSelectionTimeoutMS: 5000, // Timeout sau 5s nếu không thể kết nối
      heartbeatFrequencyMS: 30000, // Kiểm tra kết nối mỗi 30s
      maxPoolSize: 10, // Giới hạn số lượng kết nối đồng thời
    });

    // Thêm sự kiện để theo dõi kết nối
    mongoose.connection.on("connected", async () => {
      console.log("✅ MongoDB kết nối thành công");

      // EXTREME APPROACH: Fix duplicate key errors in collections
      try {
        const db = mongoose.connection.db;

        console.log(
          "Taking approach to fix duplicate key errors in collections..."
        );

        // Fix Products Collection
        try {
          console.log("Fixing products collection...");
          const productsCollection = db.collection("products");
          const allProducts = await productsCollection.find({}).toArray();
          console.log(`Found ${allProducts.length} products to process`);

          // Create a backup of all products
          const backupProducts = allProducts.map((product) => {
            // Ensure each product has a ProductID
            if (!product.ProductID) {
              product.ProductID =
                product.ID || new mongoose.Types.ObjectId().toString();
            }
            // Remove the ID field
            delete product.ID;
            return product;
          });

          // Try to drop the problematic index
          try {
            await db.command({
              dropIndexes: "products",
              index: "ID_1",
            });
            console.log("Successfully dropped ID_1 index from products");
          } catch (dropError) {
            console.log("Error dropping products index:", dropError.message);
          }

          // Update all products to remove ID field
          const updateResult = await productsCollection.updateMany(
            {},
            { $unset: { ID: "" } }
          );

          console.log(
            `Updated ${updateResult.modifiedCount} products to remove ID field`
          );
        } catch (productError) {
          console.error("Error fixing products collection:", productError);
        }

        // Fix PaymentMethods Collection
        try {
          console.log("Fixing payment methods collection...");
          const paymentMethodsCollection = db.collection("paymentmethods");
          const allPaymentMethods = await paymentMethodsCollection
            .find({})
            .toArray();
          console.log(
            `Found ${allPaymentMethods.length} payment methods to process`
          );

          // Create a map to track unique PaymentMethodIDs
          const uniquePaymentMethodIDs = new Map();

          // Process payment methods to ensure unique PaymentMethodIDs
          for (const method of allPaymentMethods) {
            if (uniquePaymentMethodIDs.has(method.PaymentMethodID)) {
              // Generate a new ID for duplicate
              method.PaymentMethodID = new mongoose.Types.ObjectId().toString();
            } else {
              uniquePaymentMethodIDs.set(method.PaymentMethodID, true);
            }
          }

          // Try to drop the problematic index
          try {
            await db.command({
              dropIndexes: "paymentmethods",
              index: "PaymentMethodID_1",
            });
            console.log("Successfully dropped PaymentMethodID_1 index");
          } catch (dropError) {
            console.log(
              "Error dropping payment methods index:",
              dropError.message
            );
          }

          // Create a temporary collection
          const tempCollectionName = "paymentmethods_temp_" + Date.now();
          await db.createCollection(tempCollectionName);
          const tempCollection = db.collection(tempCollectionName);

          // Insert all payment methods into the temporary collection
          if (allPaymentMethods.length > 0) {
            await tempCollection.insertMany(allPaymentMethods);
            console.log(
              `Inserted ${allPaymentMethods.length} payment methods into temporary collection`
            );
          }

          // Drop the original payment methods collection
          await paymentMethodsCollection.drop();
          console.log("Dropped original payment methods collection");

          // Create a new payment methods collection
          await db.createCollection("paymentmethods");
          const newPaymentMethodsCollection = db.collection("paymentmethods");

          // Create the PaymentMethodID index on the new collection
          await newPaymentMethodsCollection.createIndex(
            { PaymentMethodID: 1 },
            { unique: true, sparse: true }
          );
          console.log(
            "Created PaymentMethodID index on new payment methods collection"
          );

          // Copy all payment methods from the temporary collection to the new collection
          if (allPaymentMethods.length > 0) {
            await newPaymentMethodsCollection.insertMany(allPaymentMethods);
            console.log(
              `Inserted ${allPaymentMethods.length} payment methods into new collection`
            );
          }

          // Drop the temporary collection
          await tempCollection.drop();
          console.log("Dropped temporary payment methods collection");

          console.log(
            "Successfully recreated payment methods collection without duplicate keys"
          );
        } catch (paymentMethodError) {
          console.error(
            "Error fixing payment methods collection:",
            paymentMethodError
          );
        }
      } catch (error) {
        console.error("Error with collection fix approach:", error);

        // Fallback to a simpler approach if the main approach fails
        try {
          console.log("Falling back to simpler approach...");
          const db = mongoose.connection.db;

          // Try to fix products
          try {
            const productsCollection = db.collection("products");
            await db.command({
              dropIndexes: "products",
              index: "ID_1",
            });
            console.log("Successfully dropped ID_1 index");
          } catch (dropError) {
            console.log("Error dropping products index:", dropError.message);
          }

          // Try to fix payment methods
          try {
            const paymentMethodsCollection = db.collection("paymentmethods");
            await db.command({
              dropIndexes: "paymentmethods",
              index: "PaymentMethodID_1",
            });
            console.log("Successfully dropped PaymentMethodID_1 index");
          } catch (dropError) {
            console.log(
              "Error dropping payment methods index:",
              dropError.message
            );
          }
        } catch (fallbackError) {
          console.error("Error with fallback approach:", fallbackError);
        }
      }

      // Handle any errors during product migration
      try {
        // Additional product migration code if needed
      } catch (indexError) {
        console.error("Error handling product migration:", indexError);
      }
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
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      // Không thoát ứng dụng, chỉ ghi log
    });
  } catch (error) {
    console.error("❌ Kết nối MongoDB thất bại:", error.message);
    // Thoát quá trình với lỗi sau 3 giây để ghi log
    setTimeout(() => process.exit(1), 3000);
  }
};

module.exports = connectDB;
