var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var connectDB = require("./config/database");

var indexRouter = require("./routes/index");
var accountsRouter = require("./routes/accounts");
var productsRouter = require("./routes/products");
var categoriesRouter = require("./routes/categories");
var addressesRouter = require("./routes/addresses");
var cartsRouter = require("./routes/carts");
var cartItemsRouter = require("./routes/cartItems");
var ordersRouter = require("./routes/orders");
var orderItemsRouter = require("./routes/orderItems");
var paymentMethodsRouter = require("./routes/paymentMethods");

// Kết nối đến MongoDB
connectDB();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    return res.status(200).json({});
  }
  next();
});

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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
