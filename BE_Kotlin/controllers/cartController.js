const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

// Lấy tất cả giỏ hàng
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy giỏ hàng theo ID
exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findOne({ CartID: req.params.id });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy giỏ hàng theo Email
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

// Tạo giỏ hàng mới
exports.createCart = async (req, res) => {
  const { CartID, Email } = req.body;

  try {
    // Kiểm tra xem giỏ hàng ID đã tồn tại chưa
    let cart = await Cart.findOne({ CartID });

    if (cart) {
      return res.status(400).json({ msg: "Cart already exists" });
    }

    // Kiểm tra xem email đã có giỏ hàng chưa
    let existingCart = await Cart.findOne({ Email });

    if (existingCart) {
      return res.status(400).json({ msg: "This email already has a cart" });
    }

    // Tạo giỏ hàng mới
    cart = new Cart({
      CartID,
      Email,
    });

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Xóa giỏ hàng
exports.deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ CartID: req.params.id });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    // Xóa tất cả các mục trong giỏ hàng
    await CartItem.deleteMany({ CartID: req.params.id });

    res.json({ msg: "Cart and all items removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy tất cả các mục trong giỏ hàng
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

// Thêm sản phẩm vào giỏ hàng
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

// Cập nhật số lượng sản phẩm trong giỏ hàng
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

// Xóa sản phẩm khỏi giỏ hàng
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
