const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET /api/orders - Lấy tất cả đơn hàng
router.get('/', orderController.getAllOrders);

// GET /api/orders/:id - Lấy đơn hàng theo ID
router.get('/:id', orderController.getOrderById);

// GET /api/orders/email/:email - Lấy đơn hàng theo Email
router.get('/email/:email', orderController.getOrdersByEmail);

// POST /api/orders - Tạo đơn hàng mới
router.post('/', orderController.createOrder);

// PUT /api/orders/:id - Cập nhật trạng thái đơn hàng
router.put('/:id', orderController.updateOrderStatus);

// DELETE /api/orders/:id - Xóa đơn hàng
router.delete('/:id', orderController.deleteOrder);

module.exports = router;