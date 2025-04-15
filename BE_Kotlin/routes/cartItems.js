const express = require("express");
const router = express.Router();
const cartItemController = require("../controllers/cartItemController");

// GET /api/cart-items - Lấy tất cả các mục trong giỏ hàng
router.get("/", cartItemController.getAllCartItems);

// GET /api/cart-items/cart/:cartId - Lấy các mục trong giỏ hàng theo CartID
router.get("/cart/:cartId", cartItemController.getCartItemsByCartId);

// GET /api/cart-items/cart/:cartId/product/:productId - Lấy mục trong giỏ hàng theo CartID và ProductID
router.get(
  "/cart/:cartId/product/:productId",
  cartItemController.getCartItemByIds
);

// POST /api/cart-items - Thêm mục vào giỏ hàng
router.post("/", cartItemController.createCartItem);

// PUT /api/cart-items/:id - Cập nhật số lượng mục trong giỏ hàng bằng ID của cart item
router.put("/:id", cartItemController.updateCartItem);

// Keep this route for backward compatibility
router.put("/cart/:cartId/product/:productId", (req, res) => {
  // Combine CartID and ProductID and pass to the main update function
  req.params.id = `${req.params.cartId}_${req.params.productId}`;
  cartItemController.updateCartItem(req, res);
});

// DELETE /api/cart-items/:id - Xóa mục khỏi giỏ hàng bằng ID của cart item
router.delete("/:id", cartItemController.deleteCartItem);

// Keep these routes for backward compatibility
router.delete("/cart/:cartId/product/:productId", (req, res) => {
  // Combine CartID and ProductID and pass to the main delete function
  req.params.id = `${req.params.cartId}_${req.params.productId}`;
  cartItemController.deleteCartItem(req, res);
});

module.exports = router;
