const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");

// Configure multer storage (where to save the uploaded files)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Create an 'uploads' folder in your project root
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

/* GET products listing. */
router.get("/", productController.getAllProducts);

/* GET products by category */
router.get("/category/:cateId", productController.getProductsByCategory);

/* GET product by ID */
router.get("/:id", productController.getProductById);

/* POST create new product */
router.post("/", upload.single('Image'), productController.createProduct);

/* PUT update product */
router.put("/:id", productController.updateProduct);

/* DELETE product */
router.delete("/:id", productController.deleteProduct);

module.exports = router;
