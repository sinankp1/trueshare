const mongoose = require("mongoose");
module.exports.connect = () => {
  mongoose
    .connect(process.env.DATABASE_LOCAL, {
      useNewUrlParser: true,
    })
    .then(() => console.log("database connected"))
    .catch((err) => console.log("mongoose connection error", err));
};
 