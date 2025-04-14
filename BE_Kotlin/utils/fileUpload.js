const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

/**
 * Lưu file ảnh vào thư mục public/images
 * @param {Object} file - File từ request
 * @param {String} folder - Thư mục con trong public/images
 * @returns {String} - Đường dẫn tới file đã lưu
 */
exports.saveImage = (file, folder = 'products') => {
  return new Promise((resolve, reject) => {
    try {
      // Kiểm tra xem file có phải là ảnh không
      if (!file.mimetype.startsWith('image')) {
        return reject(new Error('Vui lòng tải lên một file ảnh'));
      }

      // Kiểm tra kích thước file (giới hạn 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return reject(new Error('Kích thước file không được vượt quá 5MB'));
      }

      // Tạo tên file ngẫu nhiên để tránh trùng lặp
      const filename = `${crypto.randomBytes(10).toString('hex')}${path.extname(file.name)}`;

      // Đường dẫn đầy đủ tới thư mục lưu file
      const uploadDir = path.join(__dirname, '../public/images', folder);

      // Tạo thư mục nếu chưa tồn tại
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Di chuyển file vào thư mục đích
      file.mv(path.join(uploadDir, filename), (err) => {
        if (err) {
          return reject(err);
        }
        
        // Trả về đường dẫn tương đối để lưu vào database
        resolve(`/images/${folder}/${filename}`);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Xóa file ảnh
 * @param {String} filePath - Đường dẫn tương đối tới file (từ /public)
 * @returns {Promise<Boolean>} - Kết quả xóa file
 */
exports.deleteImage = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      if (!filePath) {
        return resolve(true);
      }

      // Đường dẫn đầy đủ tới file
      const fullPath = path.join(__dirname, '../public', filePath);

      // Kiểm tra xem file có tồn tại không
      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        });
      } else {
        resolve(true); // File không tồn tại, coi như đã xóa thành công
      }
    } catch (error) {
      reject(error);
    }
  });
};