const express = require('express');
const router = express.Router();
const cartItemController = require('../controllers/cartItemController');

// GET /api/cart-items - Lấy tất cả các mục trong giỏ hàng
router.get('/', cartItemController.getAllCartItems);

// GET /api/cart-items/cart/:cartId - Lấy các mục trong giỏ hàng theo CartID
router.get('/cart/:cartId', cartItemController.getCartItemsByCartId);

// GET /api/cart-items/cart/:cartId/product/:productId - Lấy mục trong giỏ hàng theo CartID và ProductID
router.get('/cart/:cartId/product/:productId', cartItemController.getCartItemByIds);

// POST /api/cart-items - Thêm mục vào giỏ hàng
router.post('/', cartItemController.createCartItem);

// PUT /api/cart-items/cart/:cartId/product/:productId - Cập nhật số lượng mục trong giỏ hàng
router.put('/cart/:cartId/product/:productId', cartItemController.updateCartItem);

// DELETE /api/cart-items/cart/:cartId/product/:productId - Xóa mục khỏi giỏ hàng
router.delete('/cart/:cartId/product/:productId', cartItemController.deleteCartItem);

module.exports = router;