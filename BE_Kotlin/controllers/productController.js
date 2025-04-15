const Product = require("../models/Product");

/**
 * @api {get} /api/products Lấy tất cả products
 * @apiName GetAllProducts
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("CateID", "CateName");
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/products/:id Lấy product theo ID
 * @apiName GetProductById
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      ProductID: req.params.id,
    }).populate("CateID", "CateName");

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/products/category/:cateId Lấy products theo category
 * @apiName GetProductsByCategory
 */
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ CateID: req.params.cateId }).populate(
      "CateID",
      "CateName"
    );
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {post} /api/products Tạo product mới
 * @apiName CreateProduct
 */
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

/**
 * @api {put} /api/products/:id Cập nhật product
 * @apiName UpdateProduct
 */
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

/**
 * @api {delete} /api/products/:id Xóa product
 * @apiName DeleteProduct
 */
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
