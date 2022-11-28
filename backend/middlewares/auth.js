const jwt = require("jsonwebtoken");

exports.authUser = (req, res, next) => {
  try {
    let temp = req.header("Authorization");
    let token = temp ? temp.split(" ")[1] : "";
    if (!token) {
      return res.status(400).json({ message: "Invalid authentication" });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Invalid authenticationnnn" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.authAdmin = (req, res, next) => {
  try {
    let temp = req.header("Authorization");
    let token = temp ? temp.split(" ")[1] : "";
    if (!token) {
      return res.status(400).json({ message: "Invalid authentication" });
    }
    jwt.verify(token, process.env.ADMIN_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Invalid authenticationnnn" });
      }
      req.admin = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
