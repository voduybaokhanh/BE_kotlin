const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// GET /api/addresses - Lấy tất cả địa chỉ
router.get('/', addressController.getAllAddresses);

// GET /api/addresses/:id - Lấy địa chỉ theo ID
router.get('/:id', addressController.getAddressById);

// GET /api/addresses/email/:email - Lấy địa chỉ theo Email
router.get('/email/:email', addressController.getAddressesByEmail);

// POST /api/addresses - Tạo địa chỉ mới
router.post('/', addressController.createAddress);

// PUT /api/addresses/:id - Cập nhật địa chỉ
router.put('/:id', addressController.updateAddress);

// DELETE /api/addresses/:id - Xóa địa chỉ
router.delete('/:id', addressController.deleteAddress);

module.exports = router;