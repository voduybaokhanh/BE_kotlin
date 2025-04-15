const Account = require("../models/Account");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

/**
 * @api {get} /api/accounts Lấy tất cả accounts
 * @apiName GetAllAccounts
 */
exports.getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find().select("-Password");

    res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {get} /api/accounts/:email Lấy account theo Email
 * @apiName GetAccountByEmail
 */
exports.getAccountByEmail = async (req, res, next) => {
  try {
    const account = await Account.findOne({ Email: req.params.email }).select(
      "-Password"
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    // Kiểm tra quyền truy cập (chỉ chính người dùng đó mới có quyền xem)
    if (req.user && req.user.Email === req.params.email) {
      return res.status(200).json({
        success: true,
        data: account,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập thông tin này",
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @api {post} /api/accounts/register Đăng ký tài khoản mới
 * @apiName Register
 */
exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { Email, FullName, Password } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại chưa
    let account = await Account.findOne({ Email });

    if (account) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng",
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
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {post} /api/accounts/login Đăng nhập
 * @apiName Login
 */
exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { Email, Password } = req.body;

  try {
    // Kiểm tra xem email có tồn tại không
    const account = await Account.findOne({ Email });

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(Password, account.Password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
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
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {put} /api/accounts/:email Cập nhật thông tin tài khoản
 * @apiName UpdateAccount
 */
exports.updateAccount = async (req, res, next) => {
  try {
    const { FullName, Password, currentPassword } = req.body;

    // Kiểm tra quyền truy cập
    if (req.user.Email !== req.params.email) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền cập nhật tài khoản này",
      });
    }

    let account = await Account.findOne({ Email: req.params.email });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    // Nếu muốn đổi mật khẩu, phải cung cấp mật khẩu hiện tại
    if (Password) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp mật khẩu hiện tại",
        });
      }

      // Kiểm tra mật khẩu hiện tại
      const isMatch = await bcrypt.compare(currentPassword, account.Password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Mật khẩu hiện tại không đúng",
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
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {delete} /api/accounts/:email Xóa tài khoản
 * @apiName DeleteAccount
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    // Chỉ người dùng có thể xóa tài khoản của chính mình
    if (req.user.Email !== req.params.email) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền xóa tài khoản này",
      });
    }

    const account = await Account.findOneAndDelete({ Email: req.params.email });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tài khoản đã được xóa",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {get} /api/accounts/me Lấy thông tin tài khoản hiện tại
 * @apiName GetMe
 */
exports.getMe = async (req, res, next) => {
  try {
    const account = await Account.findOne({ Email: req.user.Email }).select(
      "-Password"
    );

    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {put} /api/accounts/change-password Đổi mật khẩu
 * @apiName ChangePassword
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới",
      });
    }

    const account = await Account.findOne({ Email: req.user.Email });

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, account.Password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu hiện tại không đúng",
      });
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    account.Password = await bcrypt.hash(newPassword, salt);

    await account.save();

    res.status(200).json({
      success: true,
      message: "Mật khẩu đã được cập nhật",
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
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "30d", // Default to 30 days if not specified
    }
  );
};
