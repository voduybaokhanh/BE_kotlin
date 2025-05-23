const mongoose = require("mongoose");
const Product = require("../models/Product");

// We've moved the migration logic to database.js

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
 * @api {get} /api/products/:id Lấy product theo ProductID
 * @apiName GetProductById
 */
exports.getProductById = async (req, res) => {
  try {
    // First try to find by ProductID
    let product = await Product.findOne({ ProductID: req.params.id }).populate(
      "CateID",
      "CateName"
    );

    // If not found, try to find by MongoDB _id for backward compatibility
    if (!product) {
      try {
        product = await Product.findById(req.params.id).populate(
          "CateID",
          "CateName"
        );
      } catch (idErr) {
        // If error occurs with findById, it's likely not a valid ObjectId
        // Just continue, product will remain null
      }
    }

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
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    // No need to check for null IDs as we're using sparse: true in the model

    const { CateID, ProductName, Description, Price, ProductID } = req.body;
    let Image = null;

    // Check if any files were uploaded
    if (req.files && req.files.length > 0) {
      // Use the first file found (you can modify this logic if needed)
      const file = req.files[0];
      Image = `/api/products/uploads/${file.filename}`;
      console.log("Image path set to:", Image);
    } else {
      console.log("No image file uploaded");
    }

    // Create product data object with generated ProductID
    const productData = {
      ProductID: ProductID || new mongoose.Types.ObjectId().toString(), // Use provided ProductID or generate a new one
      CateID,
      ProductName,
      Description,
      Price,
      Image,
    };

    // Tạo product mới
    const product = new Product(productData);

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * @api {put} /api/products/:id Cập nhật product
 * @apiName UpdateProduct
 */
exports.updateProduct = async (req, res) => {
  const { CateID, ProductName, Description, Price, Image } = req.body;

  try {
    // First try to find by ProductID
    let product = await Product.findOne({ ProductID: req.params.id });

    // If not found, try to find by MongoDB _id for backward compatibility
    if (!product) {
      try {
        product = await Product.findById(req.params.id);
      } catch (idErr) {
        // If error occurs with findById, it's likely not a valid ObjectId
        // Just continue, product will remain null
      }
    }

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
    // First try to find and delete by ProductID
    let product = await Product.findOneAndDelete({ ProductID: req.params.id });

    // If not found, try to find and delete by MongoDB _id for backward compatibility
    if (!product) {
      try {
        product = await Product.findByIdAndDelete(req.params.id);
      } catch (idErr) {
        // If error occurs with findByIdAndDelete, it's likely not a valid ObjectId
        // Just continue, product will remain null
      }
    }

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
