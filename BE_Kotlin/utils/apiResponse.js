/**
 * Lớp xử lý response API
 * @class ApiResponse
 */
class ApiResponse {
  /**
   * Tạo response thành công
   * @param {Object} res - Express response object
   * @param {String} message - Thông báo thành công
   * @param {Object|Array} data - Dữ liệu trả về
   * @param {Number} statusCode - HTTP status code
   * @returns {Object} - JSON response
   */
  static success(res, message, data, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Tạo response lỗi
   * @param {Object} res - Express response object
   * @param {String} message - Thông báo lỗi
   * @param {Number} statusCode - HTTP status code
   * @returns {Object} - JSON response
   */
  static error(res, message, statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  /**
   * Tạo response với dữ liệu phân trang
   * @param {Object} res - Express response object
   * @param {Array} data - Dữ liệu trả về
   * @param {Number} page - Trang hiện tại
   * @param {Number} limit - Số lượng item mỗi trang
   * @param {Number} total - Tổng số item
   * @returns {Object} - JSON response
   */
  static paginate(res, data, page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      success: true,
      count: data.length,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      data,
    });
  }
}

module.exports = ApiResponse;
