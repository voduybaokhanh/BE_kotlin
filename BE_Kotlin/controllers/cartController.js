const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

/**
 * @api {get} /api/carts Lấy tất cả giỏ hàng
 * @apiName GetAllCarts
 */
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/carts/:id Lấy giỏ hàng theo ID
 * @apiName GetCartById
 */
exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/carts/email/:email Lấy giỏ hàng theo Email
 * @apiName GetCartByEmail
 */
exports.getCartByEmail = async (req, res) => {
  try {
    const cart = await Cart.findOne({ Email: req.params.email });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {post} /api/carts Tạo giỏ hàng mới
 * @apiName CreateCart
 */
exports.createCart = async (req, res) => {
  try {
    // No need to check for null CartIDs as we're using sparse: true in the model

    const { Email, CartID } = req.body;

    // Create cart data object with generated CartID
    const cartData = {
      Email,
      CartID: CartID || new mongoose.Types.ObjectId().toString(), // Use provided CartID or generate a new one
    };

    // Tạo giỏ hàng mới
    const cart = new Cart(cartData);

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {delete} /api/carts/:id Xóa giỏ hàng
 * @apiName DeleteCart
 */
exports.deleteCart = async (req, res) => {
  try {
    // First find the cart to get its CartID
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const cartID = cart.CartID;

    // Delete the cart
    await Cart.findByIdAndDelete(req.params.id);

    // Delete all cart items with the matching CartID
    if (cartID) {
      await CartItem.deleteMany({ CartID: cartID });
    }

    res.json({ msg: "Cart and all items removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/carts/:cartId/items Lấy tất cả các mục trong giỏ hàng
 * @apiName GetCartItems
 */
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ CartID: req.params.cartId });

    // Lấy thông tin chi tiết sản phẩm cho mỗi mục
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
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

/**
 * @api {post} /api/carts/items Thêm sản phẩm vào giỏ hàng
 * @apiName AddItemToCart
 */
exports.addItemToCart = async (req, res) => {
  const { CartID, ProductID, Quantity } = req.body;

  try {
    // Kiểm tra xem giỏ hàng có tồn tại không
    const cart = await Cart.findOne({ CartID });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findOne({ ProductID });
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    let cartItem = await CartItem.findOne({ CartID, ProductID });

    if (cartItem) {
      // Nếu đã có, cập nhật số lượng
      cartItem.Quantity += Quantity || 1;
      await cartItem.save();
    } else {
      // Nếu chưa có, tạo mới
      cartItem = new CartItem({
        CartID,
        ProductID,
        Quantity: Quantity || 1,
      });
      await cartItem.save();
    }

    res.json(cartItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {put} /api/carts/:cartId/items/:productId Cập nhật số lượng sản phẩm trong giỏ hàng
 * @apiName UpdateCartItem
 */
exports.updateCartItem = async (req, res) => {
  const { Quantity } = req.body;

  try {
    let cartItem = await CartItem.findOne({
      CartID: req.params.cartId,
      ProductID: req.params.productId,
    });

    if (!cartItem) {
      return res.status(404).json({ msg: "Cart item not found" });
    }

    // Cập nhật số lượng
    if (Quantity !== undefined) {
      if (Quantity <= 0) {
        // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
        await CartItem.deleteOne({
          CartID: req.params.cartId,
          ProductID: req.params.productId,
        });
        return res.json({ msg: "Item removed from cart" });
      }
      cartItem.Quantity = Quantity;
    }

    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {delete} /api/carts/:cartId/items/:productId Xóa sản phẩm khỏi giỏ hàng
 * @apiName RemoveItemFromCart
 */
exports.removeItemFromCart = async (req, res) => {
  try {
    const cartItem = await CartItem.findOneAndDelete({
      CartID: req.params.cartId,
      ProductID: req.params.productId,
    });

    if (!cartItem) {
      return res.status(404).json({ msg: "Cart item not found" });
    }

    res.json({ msg: "Item removed from cart" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
