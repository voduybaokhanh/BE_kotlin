const Address = require("../models/Address");
const mongoose = require("mongoose");

/**
 * @api {get} /api/addresses Lấy tất cả địa chỉ
 * @apiName GetAllAddresses
 */
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/addresses/:id Lấy địa chỉ theo ID
 * @apiName GetAddressById
 */
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }

    res.json(address);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {get} /api/addresses/email/:email Lấy địa chỉ theo Email
 * @apiName GetAddressesByEmail
 */
exports.getAddressesByEmail = async (req, res) => {
  try {
    const addresses = await Address.find({ Email: req.params.email });
    res.json(addresses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {post} /api/addresses Tạo địa chỉ mới
 * @apiName CreateAddress
 */
exports.createAddress = async (req, res) => {
  const { Email, Street, City, Country } = req.body;

  try {
    // Tạo địa chỉ mới với AddressID tự động
    const address = new Address({
      AddressID: new mongoose.Types.ObjectId().toString(), // Tạo ID duy nhất
      Email,
      Street,
      City,
      Country,
    });

    await address.save();
    res.json(address);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {put} /api/addresses/:id Cập nhật địa chỉ
 * @apiName UpdateAddress
 */
exports.updateAddress = async (req, res) => {
  const { Email, Street, City, Country } = req.body;

  try {
    let address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }

    // Cập nhật thông tin
    if (Email) address.Email = Email;
    if (Street) address.Street = Street;
    if (City) address.City = City;
    if (Country) address.Country = Country;

    await address.save();
    res.json(address);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @api {delete} /api/addresses/:id Xóa địa chỉ
 * @apiName DeleteAddress
 */
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);

    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }

    res.json({ msg: "Address removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
