const mongoose = require("mongoose");
const Category = require("../models/Category");

/**
 * @api {get} /api/categories Lấy tất cả categories
 * @apiName GetAllCategories
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/categories/:id Lấy category theo ID
 * @apiName GetCategoryById
 */
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {post} /api/categories Tạo category mới
 * @apiName CreateCategory
 */
exports.createCategory = async (req, res) => {
  const { CateName, CateID } = req.body;

  try {
    // Create a new category object with generated CateID
    const categoryData = {
      CateName,
      CateID: CateID || new mongoose.Types.ObjectId().toString(), // Use provided CateID or generate a new one
    };

    // Tạo category mới
    const category = new Category(categoryData);

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message }); // Return more detailed error message
  }
};

/**
 * @api {put} /api/categories/:id Cập nhật category
 * @apiName UpdateCategory
 */
exports.updateCategory = async (req, res) => {
  const { CateName } = req.body;

  try {
    // Find by MongoDB _id instead of CateID
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    // Cập nhật thông tin
    if (CateName) category.CateName = CateName;

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message }); // Return more detailed error message
  }
};

/**
 * @api {delete} /api/categories/:id Xóa category
 * @apiName DeleteCategory
 */
exports.deleteCategory = async (req, res) => {
  try {
    // Find by MongoDB _id instead of CateID
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.json({ msg: "Category removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message }); // Return more detailed error message
  }
};
