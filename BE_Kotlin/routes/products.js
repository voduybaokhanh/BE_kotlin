const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage (where to save the uploaded files)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Use absolute path to uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Configure multer with any field name
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
}).any(); // Accept any field name

// Serve uploaded files statically
router.use("/uploads", express.static(uploadDir));

/* GET products listing. */
router.get("/", productController.getAllProducts);

/* GET products by category */
router.get("/category/:cateId", productController.getProductsByCategory);

/* GET product by ID */
router.get("/:id", productController.getProductById);

/* POST create new product */
router.post(
  "/",
  (req, res, next) => {
    // Use multer with any field
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        console.error("Multer error:", err);
        return res.status(500).json({ error: `Multer error: ${err.message}` });
      } else if (err) {
        // An unknown error occurred
        console.error("Unknown error:", err);
        return res.status(500).json({ error: `Unknown error: ${err.message}` });
      }

      // Log the request details
      console.log("Request headers:", req.headers);
      console.log("Request body after multer:", req.body);
      console.log("Request files:", req.files);

      // Everything went fine, proceed
      next();
    });
  },
  productController.createProduct
);

/* PUT update product */
router.put("/:id", productController.updateProduct);

/* DELETE product */
router.delete("/:id", productController.deleteProduct);

module.exports = router;
