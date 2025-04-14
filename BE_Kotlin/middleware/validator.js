const { body, validationResult } = require('express-validator');

// Middleware để xử lý kết quả validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules cho Account
const accountValidationRules = () => {
  return [
    body('Email').isEmail().withMessage('Email không hợp lệ'),
    body('FullName').notEmpty().withMessage('Tên đầy đủ là bắt buộc'),
    body('Password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
  ];
};

// Validation rules cho Product
const productValidationRules = () => {
  return [
    body('ProductID').notEmpty().withMessage('ProductID là bắt buộc'),
    body('CateID').notEmpty().withMessage('CateID là bắt buộc'),
    body('ProductName').notEmpty().withMessage('Tên sản phẩm là bắt buộc'),
    body('Price').isNumeric().withMessage('Giá phải là số')
  ];
};

// Validation rules cho Order
const orderValidationRules = () => {
  return [
    body('OrderID').notEmpty().withMessage('OrderID là bắt buộc'),
    body('Email').notEmpty().withMessage('Email là bắt buộc'),
    body('Address').notEmpty().withMessage('Địa chỉ là bắt buộc'),
    body('PaymentMethod').notEmpty().withMessage('Phương thức thanh toán là bắt buộc')
  ];
};

// Validation rules cho CartItem
const cartItemValidationRules = () => {
  return [
    body('CartID').notEmpty().withMessage('CartID là bắt buộc'),
    body('ProductID').notEmpty().withMessage('ProductID là bắt buộc'),
    body('Quantity').isInt({ min: 1 }).withMessage('Số lượng phải là số nguyên dương')
  ];
};

module.exports = {
  handleValidationErrors,
  accountValidationRules,
  productValidationRules,
  orderValidationRules,
  cartItemValidationRules
};