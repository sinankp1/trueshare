const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/tokens");
const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");

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
    const validUser = req.user.id;
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);
    if (user.id !== validUser)
      return res
        .status(400)
        .json({ message: "You are not authorized to complete this operation" });
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
    if (user.status !== true)
      return res.status(400).json({ message: "Your account is suspended" });
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
exports.sendVerification = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.verified === true)
      return res.status(400).json({ message: "You are already verified" });
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    return res
      .status(200)
      .json({ message: "Verification link has been sent to your email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findById(req.user.id);
    const profile = await User.findOne({ username }).select("-password");
    const friendship = {
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    };
    if (!profile) {
      return res.json({ ok: false });
    }

    if (
      user.friends.includes(profile._id) &&
      profile.friends.includes(user._id)
    ) {
      friendship.friends = true;
    }
    if (user.following.includes(profile._id)) {
      friendship.following = true;
    }
    if (user.requests.includes(profile._id)) {
      friendship.requestReceived = true;
    }
    if (profile.requests.includes(user._id)) {
      friendship.requestSent = true;
    }
    const posts = await Post.find({ user: profile._id })
      .populate("user")
      .populate(
        "comments.commentBy",
        "first_name last_name username picture commentAt"
      )
      .sort({ createdAt: -1 });
    await profile.populate("friends", "first_name last_name username picture");
    res.json({ ...profile.toObject(), posts, friendship });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.updateProfilePicture = async (req, res) => {
  try {
    const { url } = req.body;
    const response = await User.findByIdAndUpdate(req.user.id, {
      picture: url,
    });
    res.json(url);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.addFriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const reciever = await User.findById(req.params.id);
      if (
        !reciever.requests.includes(sender._id) &&
        !reciever.friends.includes(sender._id)
      ) {
        await reciever.updateOne({ $push: { requests: sender._id } });
        await reciever.updateOne({ $push: { followers: sender._id } });
        await sender.updateOne({ $push: { following: reciever._id } });
        res.json({ message: "friend request has been sent" });
      } else {
        return res.status(400).json({ message: "Already sent" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't send request to yourself." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.cancelRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const reciever = await User.findById(req.params.id);
      if (
        reciever.requests.includes(sender._id) &&
        !reciever.friends.includes(sender._id)
      ) {
        await reciever.updateOne({ $pull: { requests: sender._id } });
        await reciever.updateOne({ $pull: { followers: sender._id } });
        await sender.updateOne({ $pull: { following: sender._id } });
        res.json({ message: "cancellation successful" });
      } else {
        return res.status(400).json({ message: "Already cancelled" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't cancel request to yourself." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.follow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const reciever = await User.findById(req.params.id);
      if (
        !reciever.followers.includes(sender._id) &&
        !sender.following.includes(reciever._id)
      ) {
        await reciever.updateOne({ $push: { followers: sender._id } });
        await sender.updateOne({ $push: { following: reciever._id } });
        res.json({ message: "follow success" });
      } else {
        return res.status(400).json({ message: "Already following" });
      }
    } else {
      return res.status(400).json({ message: "You can't follow yourself." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.unfollow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const reciever = await User.findById(req.params.id);
      if (
        reciever.followers.includes(sender._id) &&
        sender.following.includes(reciever._id)
      ) {
        await reciever.updateOne({ $pull: { followers: sender._id } });
        await sender.updateOne({ $pull: { following: reciever._id } });
        res.json({ message: "unfollow success" });
      } else {
        return res.status(400).json({ message: "Already not following" });
      }
    } else {
      return res.status(400).json({ message: "You can't unfollow yourself." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.acceptRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const reciever = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (reciever.requests.includes(sender._id)) {
        await reciever.update({
          $push: { friends: sender._id, following: sender._id },
        });
        await sender.update({
          $push: { friends: reciever._id, followers: reciever._id },
        });
        await reciever.updateOne({ $pull: { requests: sender._id } });
        res.json({ message: "friend request accepted" });
      } else {
        return res.status(400).json({ message: "Already friends" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't accept a request from yourself." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.unfriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const reciever = await User.findById(req.params.id);
      if (
        reciever.friends.includes(sender._id) &&
        sender.friends.includes(reciever._id)
      ) {
        await reciever.update({
          $pull: {
            friends: sender._id,
            following: sender._id,
            follwers: sender._id,
          },
        });
        await sender.update({
          $pull: {
            friends: reciever._id,
            following: reciever._id,
            follwers: reciever._id,
          },
        });
        await reciever.updateOne({ $pull: { requests: sender._id } });
        res.json({ message: "unfriend success" });
      } else {
        return res.status(400).json({ message: "Already not friends" });
      }
    } else {
      return res.status(400).json({ message: "You can't unfriend yourself." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const reciever = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (reciever.requests.includes(sender._id)) {
        await reciever.update({
          $pull: {
            requests: sender._id,
            follwers: sender._id,
          },
        });
        await sender.update({
          $pull: {
            following: reciever._id,
          },
        });
        await reciever.updateOne({ $pull: { requests: sender._id } });
        res.json({ message: "request deleted successfully" });
      } else {
        return res.status(400).json({ message: "Already deleted" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't delete request of yourself." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getFriendsPageInfos = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends requests")
      .populate("friends", "first_name last_name username picture")
      .populate("requests", "first_name last_name username picture");
    const sentRequests = await User.find({
      requests: mongoose.Types.ObjectId(req.user.id),
    });
    const tempUsers = await User.find({})
      .select("first_name last_name username picture")
      .sort({ createdAt: -1 });
    const friendIds = await User.findById(req.user.id);
    let suggestions = tempUsers.filter((person) => {
      if (
        !friendIds.friends.includes(person._id) &&
        person._id.toString() !== req.user.id &&
        !friendIds.requests.includes(person._id)
      )
        return person;
    });
    let newArray = sentRequests.map((user) => user._id.toString());
    suggestions = suggestions.filter((person) => {
      if (!newArray.includes(person._id.toString())) return person;
    });
    suggestions = suggestions.slice(0, 10);
    res.json({
      friends: user.friends,
      requests: user.requests,
      sentRequests,
      suggestions,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.search = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const results = await User.find({ $text: { $search: searchTerm } }).select(
      "first_name last_name username picture"
    );
    res.json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.addToSearchHistory = async (req, res) => {
  try {
    const { searchUser } = req.body;
    const user = await User.findById(req.user.id);
    const check = user.search.find((x) => x.user.toString() === searchUser);
    const search = {
      user: searchUser,
      createdAt: new Date(),
    };
    if (check) {
      const response = await User.updateOne(
        { _id: req.user.id, "search._id": check._id },
        { $set: { "search.$.createdAt": new Date() } }
      );
      res.json(response);
    } else {
      const response = await User.findByIdAndUpdate(req.user.id, {
        $push: { search },
      });
      res.json(response);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getSearchHistory = async (req, res) => {
  try {
    const results = await User.findById(req.user.id)
      .select("search")
      .populate("search.user", "first_name last_name username picture");
    res.json(results.search);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.removeFromSearch = async (req, res) => {
  try {
    const { searchUser } = req.body;
    const response = await User.updateOne(
      { _id: req.user.id },
      { $pull: { search: { user: searchUser } } }
    );
    res.json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
