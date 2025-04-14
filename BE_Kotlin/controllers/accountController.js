const Account = require("../models/Account");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

/**
 * @desc    Lấy tất cả accounts (Admin only)
 * @route   GET /api/accounts
 * @access  Private/Admin
 */
exports.getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find().select("-Password");
    
    res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Lấy account theo Email
 * @route   GET /api/accounts/:email
 * @access  Private
 */
exports.getAccountByEmail = async (req, res, next) => {
  try {
    const account = await Account.findOne({ Email: req.params.email }).select("-Password");

    if (!account) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy tài khoản" 
      });
    }

    // Kiểm tra quyền truy cập (chỉ admin hoặc chính người dùng đó mới có quyền xem)
    if (req.user && (req.user.role === 'admin' || req.user.Email === req.params.email)) {
      return res.status(200).json({
        success: true,
        data: account
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập thông tin này"
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Đăng ký tài khoản mới
 * @route   POST /api/accounts/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  const { Email, FullName, Password } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại chưa
    let account = await Account.findOne({ Email });

    if (account) {
      return res.status(400).json({ 
        success: false,
        message: "Email đã được sử dụng" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Tạo account mới
    account = new Account({
      Email,
      FullName,
      Password: hashedPassword,
      role: 'user' // Mặc định là user
    });

    await account.save();

    // Tạo JWT token
    const token = generateToken(account);

    res.status(201).json({
      success: true,
      token,
      data: {
        Email: account.Email,
        FullName: account.FullName,
        role: account.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Đăng nhập
 * @route   POST /api/accounts/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  const { Email, Password } = req.body;

  try {
    // Kiểm tra xem email có tồn tại không
    const account = await Account.findOne({ Email });

    if (!account) {
      return res.status(401).json({ 
        success: false,
        message: "Email hoặc mật khẩu không đúng" 
      });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(Password, account.Password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Email hoặc mật khẩu không đúng" 
      });
    }

    // Tạo JWT token
    const token = generateToken(account);

    res.status(200).json({
      success: true,
      token,
      data: {
        Email: account.Email,
        FullName: account.FullName,
        role: account.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Cập nhật thông tin tài khoản
 * @route   PUT /api/accounts/:email
 * @access  Private
 */
exports.updateAccount = async (req, res, next) => {
  try {
    const { FullName, Password, currentPassword } = req.body;
    
    // Kiểm tra quyền truy cập
    if (req.user.Email !== req.params.email && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Không có quyền cập nhật tài khoản này"
      });
    }

    let account = await Account.findOne({ Email: req.params.email });

    if (!account) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy tài khoản" 
      });
    }

    // Nếu muốn đổi mật khẩu, phải cung cấp mật khẩu hiện tại
    if (Password) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp mật khẩu hiện tại"
        });
      }

      // Kiểm tra mật khẩu hiện tại
      const isMatch = await bcrypt.compare(currentPassword, account.Password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Mật khẩu hiện tại không đúng"
        });
      }

      // Hash mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      account.Password = await bcrypt.hash(Password, salt);
    }

    // Cập nhật thông tin khác
    if (FullName) account.FullName = FullName;

    await account.save();

    res.status(200).json({
      success: true,
      data: {
        Email: account.Email,
        FullName: account.FullName,
        role: account.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Xóa tài khoản
 * @route   DELETE /api/accounts/:email
 * @access  Private/Admin
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    // Chỉ admin mới có quyền xóa tài khoản
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Không có quyền xóa tài khoản"
      });
    }

    const account = await Account.findOneAndDelete({ Email: req.params.email });

    if (!account) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy tài khoản" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Tài khoản đã được xóa" 
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Lấy thông tin tài khoản hiện tại
 * @route   GET /api/accounts/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const account = await Account.findOne({ Email: req.user.Email }).select('-Password');
    
    res.status(200).json({
      success: true,
      data: account
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Đổi mật khẩu
 * @route   PUT /api/accounts/change-password
 * @access  Private
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới"
      });
    }

    const account = await Account.findOne({ Email: req.user.Email });

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, account.Password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu hiện tại không đúng"
      });
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    account.Password = await bcrypt.hash(newPassword, salt);

    await account.save();

    res.status(200).json({
      success: true,
      message: "Mật khẩu đã được cập nhật"
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to generate JWT token
const generateToken = (account) => {
  return jwt.sign(
    { 
      email: account.Email,
      fullName: account.FullName,
      role: account.role || 'user'
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.JWT_EXPIRE 
    }
  );
};
