const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ OrderID: req.params.id })
      .populate('Email', 'FullName')
      .populate('Address')
      .populate('PaymentMethod', 'MethodName');

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Lấy các mục trong đơn hàng với thông tin sản phẩm
    const orderItems = await OrderItem.find({ OrderID: req.params.id })
      .populate({
        path: 'ProductID',
        model: 'Product',
        select: 'ProductName Price Image Description'
      });

    res.json({
      order,
      items: orderItems
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy đơn hàng theo Email
exports.getOrdersByEmail = async (req, res) => {
  try {
    const orders = await Order.find({ Email: req.params.email })
      .populate('Address')
      .populate('PaymentMethod', 'MethodName');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  const { OrderID, Email, Address, PaymentMethod, OrderItems } = req.body;

  try {
    // Kiểm tra xem đơn hàng ID đã tồn tại chưa
    let order = await Order.findOne({ OrderID });

    if (order) {
      return res.status(400).json({ msg: "Order already exists" });
    }

    // Tạo đơn hàng mới
    order = new Order({
      OrderID,
      Email,
      Address,
      PaymentMethod,
      OrderDate: new Date(),
      Status: "Pending"
    });

    await order.save();

    // Thêm các mục vào đơn hàng
    if (OrderItems && OrderItems.length > 0) {
      const orderItemPromises = OrderItems.map(async (item) => {
        const { ProductID, Quantity, Price } = item;
        
        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findOne({ ProductID });
        if (!product) {
          throw new Error(`Product with ID ${ProductID} not found`);
        }
        
        const orderItem = new OrderItem({
          OrderID,
          ProductID,
          Quantity,
          Price: Price || product.Price
        });
        
        return orderItem.save();
      });
      
      await Promise.all(orderItemPromises);
    }

    // Lấy đơn hàng đầy đủ với các mục
    const orderItems = await OrderItem.find({ OrderID });
    
    res.json({
      order,
      items: orderItems
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error: " + err.message);
  }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  const { Status } = req.body;

  try {
    let order = await Order.findOne({ OrderID: req.params.id });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Cập nhật trạng thái
    if (Status) order.Status = Status;

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ OrderID: req.params.id });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Xóa tất cả các mục trong đơn hàng
    await OrderItem.deleteMany({ OrderID: req.params.id });

    res.json({ msg: "Order and all items removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};