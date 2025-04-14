const Product = require("../models/Product");

// Lấy tất cả products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy product theo ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ ProductID: req.params.id });

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy products theo category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ CateID: req.params.cateId });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Tạo product mới
exports.createProduct = async (req, res) => {
  const { ProductID, CateID, ProductName, Description, Price, Image } =
    req.body;

  try {
    // Kiểm tra xem product ID đã tồn tại chưa
    let product = await Product.findOne({ ProductID });

    if (product) {
      return res.status(400).json({ msg: "Product already exists" });
    }

    // Tạo product mới
    product = new Product({
      ProductID,
      CateID,
      ProductName,
      Description,
      Price,
      Image,
    });

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Cập nhật product
exports.updateProduct = async (req, res) => {
  const { CateID, ProductName, Description, Price, Image } = req.body;

  try {
    let product = await Product.findOne({ ProductID: req.params.id });

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Cập nhật thông tin
    if (CateID) product.CateID = CateID;
    if (ProductName) product.ProductName = ProductName;
    if (Description !== undefined) product.Description = Description;
    if (Price) product.Price = Price;
    if (Image !== undefined) product.Image = Image;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Xóa product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      ProductID: req.params.id,
    });

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
