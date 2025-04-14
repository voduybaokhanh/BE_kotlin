/**
 * Tạo ID ngẫu nhiên
 * @param {Number} length - Độ dài của ID
 * @returns {String} - ID ngẫu nhiên
 */
exports.generateRandomId = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Tạo mã đơn hàng
 * @returns {String} - Mã đơn hàng theo định dạng ORD-YYYYMMDD-XXXXX
 */
exports.generateOrderCode = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");

  return `ORD-${year}${month}${day}-${random}`;
};

/**
 * Tính tổng giá trị đơn hàng
 * @param {Array} items - Danh sách các mục trong đơn hàng
 * @returns {Number} - Tổng giá trị đơn hàng
 */
exports.calculateOrderTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.Price * item.Quantity;
  }, 0);
};

/**
 * Kiểm tra xem một chuỗi có phải là ObjectId hợp lệ không
 * @param {String} id - Chuỗi cần kiểm tra
 * @returns {Boolean} - Kết quả kiểm tra
 */
exports.isValidObjectId = (id) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
};

/**
 * Lọc các trường không cần thiết khỏi object
 * @param {Object} obj - Object cần lọc
 * @param {Array} allowedFields - Danh sách các trường được phép
 * @returns {Object} - Object sau khi lọc
 */
exports.filterObject = (obj, allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

/**
 * Chuyển đổi chuỗi query thành object để sử dụng trong mongoose
 * @param {String} queryStr - Chuỗi query
 * @returns {Object} - Object query
 */
exports.buildQuery = (queryStr) => {
  // Tạo bản sao của queryStr
  const queryObj = { ...queryStr };

  // Loại bỏ các trường đặc biệt
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((field) => delete queryObj[field]);

  // Thêm $ cho các toán tử so sánh
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  return JSON.parse(queryString);
};
