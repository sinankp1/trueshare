const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateTokenAdmin } = require("../helpers/tokens");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const User = require("../models/User");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "User does not exist" });
    const check = await bcrypt.compare(password, admin.password);
    if (!check)
      return res.status(400).json({ message: "Incorrect loign details" });
    const token = generateTokenAdmin({ id: admin._id.toString() }, "7d");
    res.send({
      id: admin._id,
      name: admin.name,
      token: token,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const cryptedPassword = await bcrypt.hash(password, 12);
    const admin = await new Admin({
      name,
      email,
      password: cryptedPassword,
    }).save();
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "first_name last_name email username status verified gender picture"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.blockUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    await user.updateOne({ $set: { status: !user.status } });
    const users = await User.find().select(
      "first_name last_name email username status verified gender picture"
    );
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
