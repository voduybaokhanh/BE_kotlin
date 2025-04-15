const mongoose = require("mongoose");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const Order = require("../models/Order");

/**
 * @api {get} /api/order-items Lấy tất cả các mục trong đơn hàng
 * @apiName GetAllOrderItems
 */
exports.getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.find();
    res.json(orderItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/order-items/order/:orderId Lấy các mục trong đơn hàng theo OrderID
 * @apiName GetOrderItemsByOrderId
 */
exports.getOrderItemsByOrderId = async (req, res) => {
  try {
    const orderItems = await OrderItem.find({
      OrderID: req.params.orderId,
    }).populate({
      path: "ProductID",
      model: "Product",
      select: "ProductName Price Image Description",
    });

    res.json(orderItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/order-items/order/:orderId/product/:productId Lấy mục trong đơn hàng theo OrderID và ProductID
 * @apiName GetOrderItemByIds
 */
exports.getOrderItemByIds = async (req, res) => {
  try {
    const orderItem = await OrderItem.findOne({
      OrderID: req.params.orderId,
      ProductID: req.params.productId,
    }).populate({
      path: "ProductID",
      model: "Product",
      select: "ProductName Price Image Description",
    });

    if (!orderItem) {
      return res.status(404).json({ msg: "Order item not found" });
    }

    res.json(orderItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/order-items/:id Lấy mục trong đơn hàng theo ID
 * @apiName GetOrderItemById
 */
exports.getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findOne({
      OrderItemID: req.params.id,
    }).populate({
      path: "ProductID",
      model: "Product",
      select: "ProductName Price Image Description",
    });

    if (!orderItem) {
      return res.status(404).json({ msg: "Order item not found" });
    }

    res.json(orderItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {post} /api/order-items Thêm mục vào đơn hàng
 * @apiName CreateOrderItem
 */
exports.createOrderItem = async (req, res) => {
  const { OrderID, ProductID, Quantity, Price } = req.body;

  try {
    // Kiểm tra xem đơn hàng có tồn tại không
    const order = await Order.findOne({ OrderID });
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findOne({ ProductID });
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Kiểm tra xem mục đã tồn tại trong đơn hàng chưa
    let orderItem = await OrderItem.findOne({ OrderID, ProductID });

    if (orderItem) {
      return res
        .status(400)
        .json({ msg: "Item already exists in order. Use PUT to update." });
    }

    // Tạo mục mới với OrderItemID
    orderItem = new OrderItem({
      OrderItemID: new mongoose.Types.ObjectId().toString(),
      OrderID,
      ProductID,
      Quantity,
      Price: Price || product.Price,
    });

    await orderItem.save();

    res.json({
      ...orderItem.toObject(),
      product: product,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {put} /api/order-items/order/:orderId/product/:productId Cập nhật mục trong đơn hàng theo OrderID và ProductID
 * @apiName UpdateOrderItemByOrderAndProduct
 */
exports.updateOrderItem = async (req, res) => {
  const { Quantity, Price } = req.body;

  try {
    let orderItem = await OrderItem.findOne({
      OrderID: req.params.orderId,
      ProductID: req.params.productId,
    });

    if (!orderItem) {
      return res.status(404).json({ msg: "Order item not found" });
    }

    // Cập nhật thông tin
    if (Quantity !== undefined) orderItem.Quantity = Quantity;
    if (Price !== undefined) orderItem.Price = Price;

    await orderItem.save();

    // Lấy thông tin chi tiết sản phẩm
    const product = await Product.findOne({ ProductID: orderItem.ProductID });

    res.json({
      ...orderItem.toObject(),
      product: product,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {put} /api/order-items/:id Cập nhật mục trong đơn hàng theo ID
 * @apiName UpdateOrderItemById
 */
exports.updateOrderItemById = async (req, res) => {
  const { Quantity, Price } = req.body;

  try {
    let orderItem = await OrderItem.findOne({
      OrderItemID: req.params.id,
    });

    if (!orderItem) {
      return res.status(404).json({ msg: "Order item not found" });
    }

    // Cập nhật thông tin
    if (Quantity !== undefined) orderItem.Quantity = Quantity;
    if (Price !== undefined) orderItem.Price = Price;

    await orderItem.save();

    // Lấy thông tin chi tiết sản phẩm
    const product = await Product.findOne({ ProductID: orderItem.ProductID });

    res.json({
      ...orderItem.toObject(),
      product: product,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {delete} /api/order-items/order/:orderId/product/:productId Xóa mục khỏi đơn hàng theo OrderID và ProductID
 * @apiName DeleteOrderItemByOrderAndProduct
 */
exports.deleteOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findOneAndDelete({
      OrderID: req.params.orderId,
      ProductID: req.params.productId,
    });

    if (!orderItem) {
      return res.status(404).json({ msg: "Order item not found" });
    }

    res.json({ msg: "Item removed from order" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {delete} /api/order-items/:id Xóa mục khỏi đơn hàng theo ID
 * @apiName DeleteOrderItemById
 */
exports.deleteOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findOneAndDelete({
      OrderItemID: req.params.id,
    });

    if (!orderItem) {
      return res.status(404).json({ msg: "Order item not found" });
    }

    res.json({ msg: "Item removed from order" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
