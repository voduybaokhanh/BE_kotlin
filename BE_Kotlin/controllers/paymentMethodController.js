const PaymentMethod = require("../models/PaymentMethod");

/**
 * @api {get} /api/payment-methods Lấy tất cả phương thức thanh toán
 * @apiName GetAllPaymentMethods
 */
exports.getAllPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find();
    res.json(paymentMethods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/payment-methods/:id Lấy phương thức thanh toán theo ID
 * @apiName GetPaymentMethodById
 */
exports.getPaymentMethodById = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({
      PaymentMethodID: req.params.id,
    });

    if (!paymentMethod) {
      return res.status(404).json({ msg: "Payment method not found" });
    }

    res.json(paymentMethod);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {post} /api/payment-methods Tạo phương thức thanh toán mới
 * @apiName CreatePaymentMethod
 */
exports.createPaymentMethod = async (req, res) => {
  const { PaymentMethodID, MethodName } = req.body;

  try {
    // Kiểm tra xem phương thức thanh toán ID đã tồn tại chưa
    let paymentMethod = await PaymentMethod.findOne({ PaymentMethodID });

    if (paymentMethod) {
      return res.status(400).json({ msg: "Payment method already exists" });
    }

    // Tạo phương thức thanh toán mới
    paymentMethod = new PaymentMethod({
      PaymentMethodID,
      MethodName,
    });

    await paymentMethod.save();
    res.json(paymentMethod);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {put} /api/payment-methods/:id Cập nhật phương thức thanh toán
 * @apiName UpdatePaymentMethod
 */
exports.updatePaymentMethod = async (req, res) => {
  const { MethodName } = req.body;

  try {
    let paymentMethod = await PaymentMethod.findOne({
      PaymentMethodID: req.params.id,
    });

    if (!paymentMethod) {
      return res.status(404).json({ msg: "Payment method not found" });
    }

    // Cập nhật thông tin
    if (MethodName) paymentMethod.MethodName = MethodName;

    await paymentMethod.save();
    res.json(paymentMethod);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {delete} /api/payment-methods/:id Xóa phương thức thanh toán
 * @apiName DeletePaymentMethod
 */
exports.deletePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOneAndDelete({
      PaymentMethodID: req.params.id,
    });

    if (!paymentMethod) {
      return res.status(404).json({ msg: "Payment method not found" });
    }

    res.json({ msg: "Payment method removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
