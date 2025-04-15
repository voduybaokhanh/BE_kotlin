const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

/**
 * @api {get} /api/cart-items Lấy tất cả các mục trong giỏ hàng
 * @apiName GetAllCartItems
 */
exports.getAllCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.json(cartItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/cart-items/cart/:cartId Lấy các mục trong giỏ hàng theo CartID
 * @apiName GetCartItemsByCartId
 */
exports.getCartItemsByCartId = async (req, res) => {
  try {
    const cartItems = await CartItem.find({
      CartID: req.params.cartId,
    }).populate({
      path: "ProductID",
      model: "Product",
      select: "ProductName Price Image Description",
    });

    res.json(cartItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/cart-items/:cartId/:productId Lấy mục trong giỏ hàng theo CartID và ProductID
 * @apiName GetCartItemByIds
 */
exports.getCartItemByIds = async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({
      CartID: req.params.cartId,
      ProductID: req.params.productId,
    }).populate({
      path: "ProductID",
      model: "Product",
      select: "ProductName Price Image Description",
    });

    if (!cartItem) {
      return res.status(404).json({ msg: "Cart item not found" });
    }

    res.json(cartItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {post} /api/cart-items Thêm mục vào giỏ hàng
 * @apiName CreateCartItem
 */
exports.createCartItem = async (req, res) => {
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

    // Kiểm tra xem mục đã tồn tại trong giỏ hàng chưa
    let cartItem = await CartItem.findOne({ CartID, ProductID });

    if (cartItem) {
      return res.status(400).json({
        msg: "Item already exists in cart. Use PUT to update quantity.",
      });
    }

    // Tạo mục mới
    cartItem = new CartItem({
      CartID,
      ProductID,
      Quantity: Quantity || 1,
    });

    await cartItem.save();

    res.json({
      ...cartItem.toObject(),
      product: product,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {put} /api/cart-items/:id Cập nhật số lượng mục trong giỏ hàng
 * @apiName UpdateCartItem
 * @apiDescription Cập nhật số lượng sản phẩm trong giỏ hàng bằng ID của cart item
 */
exports.updateCartItem = async (req, res) => {
  const { Quantity } = req.body;
  const id = req.params.id;

  try {
    let cartItem;

    // Check if the ID is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // If it's a valid ObjectId, find by _id
      cartItem = await CartItem.findById(id);
    } else {
      // If not a valid ObjectId, it might be a CartID/ProductID combination
      const [cartId, productId] = id.split("_");
      if (cartId && productId) {
        cartItem = await CartItem.findOne({
          CartID: cartId,
          ProductID: productId,
        });
      }
    }

    if (!cartItem) {
      return res.status(404).json({ msg: "Cart item not found" });
    }

    // Cập nhật số lượng
    if (Quantity !== undefined) {
      if (Quantity <= 0) {
        // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          await CartItem.findByIdAndDelete(id);
        } else {
          const [cartId, productId] = id.split("_");
          if (cartId && productId) {
            await CartItem.deleteOne({
              CartID: cartId,
              ProductID: productId,
            });
          }
        }
        return res.json({ msg: "Item removed from cart" });
      }
      cartItem.Quantity = Quantity;
    }

    await cartItem.save();

    // Lấy thông tin chi tiết sản phẩm
    const product = await Product.findOne({ ProductID: cartItem.ProductID });

    res.json({
      ...cartItem.toObject(),
      product: product,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {delete} /api/cart-items/:id Xóa mục khỏi giỏ hàng theo ID
 * @apiName DeleteCartItem
 * @apiDescription Xóa sản phẩm khỏi giỏ hàng bằng ID của cart item
 */
exports.deleteCartItem = async (req, res) => {
  try {
    let cartItem;
    const id = req.params.id;

    // Check if the ID is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // If it's a valid ObjectId, try to delete by _id
      cartItem = await CartItem.findByIdAndDelete(id);
    } else {
      // If not a valid ObjectId, it might be a CartID/ProductID combination
      const [cartId, productId] = id.split("_");
      if (cartId && productId) {
        cartItem = await CartItem.findOneAndDelete({
          CartID: cartId,
          ProductID: productId,
        });
      }
    }

    if (!cartItem) {
      return res.status(404).json({ msg: "Cart item not found" });
    }

    res.json({ msg: "Item removed from cart" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Keep this as an alias for backward compatibility
exports.deleteCartItemById = exports.deleteCartItem;
