const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail } = require("../helpers/mailer");
exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      gender,
      bYear,
      bMonth,
      bDay,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const check = await User.findOne({ email });
    if (check) {
      return res
        .status(400)
        .json({ message: "Email already exists, try using another email" });
    }

    if (!validateLength(first_name, 3, 30)) {
      return res
        .status(400)
        .json({ message: "First name should be between 3 and 30 characters" });
    }
    if (!validateLength(last_name, 1, 30)) {
      return res
        .status(400)
        .json({ message: "Last name should be between 3 and 30 characters" });
    }
    if (!validateLength(password, 6, 40)) {
      return res
        .status(400)
        .json({ message: "Password should be between 6 and 40 characters" });
    }
    const cryptedPassword = await bcrypt.hash(password, 12);
    let tempUsername = first_name + last_name;
    let username = await validateUsername(tempUsername);
    const user = await new User({
      first_name,
      last_name,
      username,
      email,
      password: cryptedPassword,
      gender,
      bYear,
      bMonth,
      bDay,
    }).save();
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      picture: user.picture,
      token: token,
      verified: user.verified,
      message: "Registration successful please verify your email",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
exports.activateAccout = async (req, res) => {
  try {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);
    if (check.verified == true) {
      return res.status(400).json({ message: "Account already activated" });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res
        .status(200)
        .json({ message: "account activated successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });
    const check = await bcrypt.compare(password, user.password);
    if (!check)
      return res.status(400).json({ message: "Incorrect loign details" });
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      picture: user.picture,
      token: token,
      verified: user.verified,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
