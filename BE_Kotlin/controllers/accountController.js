const Account = require("../models/Account");

// Lấy tất cả accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().select("-Password");
    res.json(accounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy account theo Email
exports.getAccountByEmail = async (req, res) => {
  try {
    const account = await Account.findOne({ Email: req.params.email }).select(
      "-Password"
    );

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    res.json(account);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Tạo account mới
exports.createAccount = async (req, res) => {
  const { Email, FullName, Password } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại chưa
    let account = await Account.findOne({ Email });

    if (account) {
      return res.status(400).json({ msg: "Account already exists" });
    }

    // Tạo account mới
    account = new Account({
      Email,
      FullName,
      Password, // Trong thực tế, bạn nên hash password trước khi lưu
    });

    await account.save();

    // Trả về account không kèm password
    const response = account.toObject();
    delete response.Password;

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Cập nhật account
exports.updateAccount = async (req, res) => {
  const { FullName, Password } = req.body;

  try {
    let account = await Account.findOne({ Email: req.params.email });

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    // Cập nhật thông tin
    if (FullName) account.FullName = FullName;
    if (Password) account.Password = Password;

    await account.save();

    // Trả về account không kèm password
    const response = account.toObject();
    delete response.Password;

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Xóa account
exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({ Email: req.params.email });

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    res.json({ msg: "Account removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Kiểm tra xem email có tồn tại không
    const account = await Account.findOne({ Email });

    if (!account) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Kiểm tra password
    if (Password !== account.Password) {
      // Trong thực tế, bạn nên so sánh hash
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Trả về account không kèm password
    const response = account.toObject();
    delete response.Password;

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
