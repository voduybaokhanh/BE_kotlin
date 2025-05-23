const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
require("dotenv").config();

// Database connection
const connectDB = require("./config/database");

// Route imports
const indexRouter = require("./routes/index");
const accountsRouter = require("./routes/accounts");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const addressesRouter = require("./routes/addresses");
const cartsRouter = require("./routes/carts");
const cartItemsRouter = require("./routes/cartItems");
const ordersRouter = require("./routes/orders");
const orderItemsRouter = require("./routes/orderItems");
const paymentMethodsRouter = require("./routes/paymentMethods");

// Kết nối đến MongoDB
connectDB();

// Direct fix for duplicate key errors
const mongoose = require("mongoose");
mongoose.connection.once("open", async () => {
  try {
    console.log("Applying direct fix for duplicate key errors...");
    const db = mongoose.connection.db;

    // Try to drop the problematic index for products
    try {
      await db.command({
        dropIndexes: "products",
        index: "ID_1",
      });
      console.log(
        "Successfully dropped ID_1 index from products directly from app.js"
      );
    } catch (error) {
      console.log("Error dropping products index from app.js:", error.message);
    }

    // Try to drop the problematic index for payment methods
    try {
      await db.command({
        dropIndexes: "paymentmethods",
        index: "PaymentMethodID_1",
      });
      console.log(
        "Successfully dropped PaymentMethodID_1 index from payment methods directly from app.js"
      );
    } catch (error) {
      console.log(
        "Error dropping payment methods index from app.js:",
        error.message
      );
    }

    // Fix duplicate PaymentMethodIDs
    try {
      const paymentMethodsCollection = db.collection("paymentmethods");

      // Get all payment methods
      const allPaymentMethods = await paymentMethodsCollection
        .find({})
        .toArray();
      console.log(
        `Found ${allPaymentMethods.length} payment methods to check for duplicates`
      );

      // Track seen IDs to find duplicates
      const seenIds = new Set();
      let fixCount = 0;

      // Update any duplicates with new IDs
      for (const method of allPaymentMethods) {
        if (method.PaymentMethodID && seenIds.has(method.PaymentMethodID)) {
          // This is a duplicate, update it with a new ID
          const newId = new mongoose.Types.ObjectId().toString();
          await paymentMethodsCollection.updateOne(
            { _id: method._id },
            { $set: { PaymentMethodID: newId } }
          );
          fixCount++;
        } else if (method.PaymentMethodID) {
          seenIds.add(method.PaymentMethodID);
        }
      }

      console.log(`Fixed ${fixCount} duplicate payment method IDs`);
    } catch (error) {
      console.error(
        "Error fixing duplicate payment method IDs:",
        error.message
      );
    }
  } catch (error) {
    console.error("Error in direct fix:", error);
  }
});

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://yourdomain.com", "https://www.yourdomain.com"]
      : process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Logging middleware
app.use(logger(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, "public")));
// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// JWT authentication middleware - exclude paths that don't need auth
const jwtMiddleware = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false,
}).unless({
  path: [
    "/",
    "/api/accounts/login",
    "/api/accounts/register",
    { url: /^\/api\/products.*/, methods: ["GET"] },
    { url: /^\/api\/categories.*/, methods: ["GET"] },
  ],
});

// Apply JWT middleware
app.use(jwtMiddleware);

// Handle JWT errors
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  next(err);
});

// Routes
app.use("/", indexRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/addresses", addressesRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/cart-items", cartItemsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/order-items", orderItemsRouter);
app.use("/api/payment-methods", paymentMethodsRouter);

// API documentation route
app.get("/api-docs", (req, res) => {
  res.render("api-docs", { title: "API Documentation" });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // log error
  console.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  // send error response
  if (req.path.startsWith("/api")) {
    // API error - return JSON
    return res.status(err.status || 500).json({
      error: {
        message: err.message,
        status: err.status || 500,
      },
    });
  }

  // Web error - render error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
