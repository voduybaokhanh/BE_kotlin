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
    const category = await Category.findOne({ CateID: req.params.id });

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
  const { CateID, CateName } = req.body;

  try {
    // Kiểm tra xem category ID đã tồn tại chưa
    let category = await Category.findOne({ CateID });

    if (category) {
      return res.status(400).json({ msg: "Category already exists" });
    }

    // Tạo category mới
    category = new Category({
      CateID,
      CateName
    });

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {put} /api/categories/:id Cập nhật category
 * @apiName UpdateCategory
 */
exports.updateCategory = async (req, res) => {
  const { CateName } = req.body;

  try {
    let category = await Category.findOne({ CateID: req.params.id });

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    // Cập nhật thông tin
    if (CateName) category.CateName = CateName;

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {delete} /api/categories/:id Xóa category
 * @apiName DeleteCategory
 */
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ CateID: req.params.id });

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.json({ msg: "Category removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};