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
    const product = await Product.findById(req.params.id).populate(
      "CateID",
      "CateName"
    );

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

    // First, check if there are any existing products with null ID or ProductID
    // and update them to prevent duplicate key errors
    try {
      // Fix products with null ID
      const productsWithNullID = await Product.find({ ID: null });
      if (productsWithNullID.length > 0) {
        console.log(
          `Found ${productsWithNullID.length} products with null ID. Updating them...`
        );

        for (const product of productsWithNullID) {
          const newID =
            "ID_" +
            Date.now().toString() +
            Math.floor(Math.random() * 1000).toString();
          product.ID = newID;
          await product.save();
          console.log(`Updated product ${product._id} with new ID: ${newID}`);

          // Add a small delay to ensure unique timestamps
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }

      // Fix products with null ProductID
      const productsWithNullProductID = await Product.find({ ProductID: null });
      if (productsWithNullProductID.length > 0) {
        console.log(
          `Found ${productsWithNullProductID.length} products with null ProductID. Updating them...`
        );

        for (const product of productsWithNullProductID) {
          const newProductID =
            "PROD_" +
            Date.now().toString() +
            Math.floor(Math.random() * 1000).toString();
          product.ProductID = newProductID;
          await product.save();
          console.log(
            `Updated product ${product._id} with new ProductID: ${newProductID}`
          );

          // Add a small delay to ensure unique timestamps
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }
    } catch (fixErr) {
      console.error("Error fixing existing products:", fixErr);
      // Continue with creating the new product even if fixing fails
    }

    const { CateID, ProductName, Description, Price, ProductID, ID } = req.body;
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

    // Create product data object
    const productData = {
      CateID,
      ProductName,
      Description,
      Price,
      Image,
    };

    // Only add ID if it's explicitly provided
    if (ID !== undefined && ID !== null) {
      productData.ID = ID;
    }

    // Only add ProductID if it's explicitly provided
    if (ProductID !== undefined && ProductID !== null) {
      productData.ProductID = ProductID;
    }
    // If ID or ProductID is not provided, the default function in the schema will generate one

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
    let product = await Product.findById(req.params.id);

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
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
