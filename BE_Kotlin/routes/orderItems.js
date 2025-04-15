const express = require("express");
const router = express.Router();
const orderItemController = require("../controllers/orderItemController");

// GET /api/order-items - Lấy tất cả các mục trong đơn hàng
router.get("/", orderItemController.getAllOrderItems);

// GET /api/order-items/order/:orderId - Lấy các mục trong đơn hàng theo OrderID
router.get("/order/:orderId", orderItemController.getOrderItemsByOrderId);

// GET /api/order-items/order/:orderId/product/:productId - Lấy mục trong đơn hàng theo OrderID và ProductID
router.get(
  "/order/:orderId/product/:productId",
  orderItemController.getOrderItemByIds
);

// GET /api/order-items/:id - Lấy mục trong đơn hàng theo ID
router.get("/:id", orderItemController.getOrderItemById);

// POST /api/order-items - Thêm mục vào đơn hàng
router.post("/", orderItemController.createOrderItem);

// PUT /api/order-items/order/:orderId/product/:productId - Cập nhật mục trong đơn hàng theo OrderID và ProductID
router.put(
  "/order/:orderId/product/:productId",
  orderItemController.updateOrderItem
);

// PUT /api/order-items/:id - Cập nhật mục trong đơn hàng theo ID
router.put("/:id", orderItemController.updateOrderItemById);

// DELETE /api/order-items/order/:orderId/product/:productId - Xóa mục khỏi đơn hàng theo OrderID và ProductID
router.delete(
  "/order/:orderId/product/:productId",
  orderItemController.deleteOrderItem
);

// DELETE /api/order-items/:id - Xóa mục khỏi đơn hàng theo ID
router.delete("/:id", orderItemController.deleteOrderItemById);

module.exports = router;
