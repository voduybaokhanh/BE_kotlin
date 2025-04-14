const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET /api/carts - Lấy tất cả giỏ hàng
router.get('/', cartController.getAllCarts);

// GET /api/carts/:id - Lấy giỏ hàng theo ID
router.get('/:id', cartController.getCartById);

// GET /api/carts/email/:email - Lấy giỏ hàng theo Email
router.get('/email/:email', cartController.getCartByEmail);

// POST /api/carts - Tạo giỏ hàng mới
router.post('/', cartController.createCart);

// DELETE /api/carts/:id - Xóa giỏ hàng
router.delete('/:id', cartController.deleteCart);

// GET /api/carts/:cartId/items - Lấy tất cả các mục trong giỏ hàng
router.get('/:cartId/items', cartController.getCartItems);

// POST /api/carts/items - Thêm sản phẩm vào giỏ hàng
router.post('/items', cartController.addItemToCart);

// PUT /api/carts/:cartId/items/:productId - Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/:cartId/items/:productId', cartController.updateCartItem);

// DELETE /api/carts/:cartId/items/:productId - Xóa sản phẩm khỏi giỏ hàng
router.delete('/:cartId/items/:productId', cartController.removeItemFromCart);

module.exports = router;