const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/* GET products listing. */
router.get('/', productController.getAllProducts);

/* GET product by ID */
router.get('/:id', productController.getProductById);

/* GET products by category */
router.get('/category/:cateId', productController.getProductsByCategory);

/* POST create new product */
router.post('/', productController.createProduct);

/* PUT update product */
router.put('/:id', productController.updateProduct);

/* DELETE product */
router.delete('/:id', productController.deleteProduct);

module.exports = router;