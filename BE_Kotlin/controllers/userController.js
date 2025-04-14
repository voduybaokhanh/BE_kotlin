const User = require("../models/User");

// Lấy tất cả users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy user theo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(500).send("Server Error");
  }
};

// Tạo user mới
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại chưa
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Tạo user mới
    user = new User({
      name,
      email,
      password, // Trong thực tế, bạn nên hash password trước khi lưu
    });

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Cập nhật user
exports.updateUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Cập nhật thông tin
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(500).send("Server Error");
  }
};

// Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.remove();

    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(500).send("Server Error");
  }
};
