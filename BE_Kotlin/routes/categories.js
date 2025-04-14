const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/* GET categories listing. */
router.get('/', categoryController.getAllCategories);

/* GET category by ID */
router.get('/:id', categoryController.getCategoryById);

/* POST create new category */
router.post('/', categoryController.createCategory);

/* PUT update category */
router.put('/:id', categoryController.updateCategory);

/* DELETE category */
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;