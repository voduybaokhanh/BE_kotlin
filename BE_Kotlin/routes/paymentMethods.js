const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');

// GET /api/payment-methods - Lấy tất cả phương thức thanh toán
router.get('/', paymentMethodController.getAllPaymentMethods);

// GET /api/payment-methods/:id - Lấy phương thức thanh toán theo ID
router.get('/:id', paymentMethodController.getPaymentMethodById);

// POST /api/payment-methods - Tạo phương thức thanh toán mới
router.post('/', paymentMethodController.createPaymentMethod);

// PUT /api/payment-methods/:id - Cập nhật phương thức thanh toán
router.put('/:id', paymentMethodController.updatePaymentMethod);

// DELETE /api/payment-methods/:id - Xóa phương thức thanh toán
router.delete('/:id', paymentMethodController.deletePaymentMethod);

module.exports = router;