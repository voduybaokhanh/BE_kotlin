const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Lấy tất cả các mục trong đơn hàng
exports.getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.find();
    res.json(orderItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy các mục trong đơn hàng theo OrderID
exports.getOrderItemsByOrderId = async (req, res) => {
  try {
    const orderItems = await OrderItem.find({ OrderID: req.params.orderId });

    // Lấy thông tin chi tiết sản phẩm cho mỗi mục
    const itemsWithDetails = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findOne({ ProductID: item.ProductID });
        return {
          ...item.toObject(),
          product: product,
        };
      })
    );

    res.json(itemsWithDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy mục trong đơn hàng theo OrderID và ProductID
exports.getOrderItemByIds = async (req, res) => {
  try {
    const orderItem = await OrderItem.findOne({
      OrderID: req.params.orderId,
      ProductID: req.params.productId,
    });

    if (!orderItem) {
      return res.status(404).json({ msg: "Order item not found" });
    }

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

// Thêm mục vào đơn hàng
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

    // Tạo mục mới
    orderItem = new OrderItem({
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

// Cập nhật mục trong đơn hàng
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

// Xóa mục khỏi đơn hàng
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
