const express = require("express");
const { readdirSync } = require("fs");
const logger = require("morgan")
const app = express();
const dotenv = require("dotenv");
const fileupload = require("express-fileupload");
app.use(express.json())
app.use(logger("dev"))
dotenv.config();
const cors = require("cors");
const { connect } = require("./config/connection");
app.use(cors());
app.use(fileupload({
  useTempFiles:true,
}))
//routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

//database
connect();


app.listen(process.env.PORT, () => {
  console.log("listening on port 8000");
});