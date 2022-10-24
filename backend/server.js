const express = require("express");
const { readdirSync } = require("fs");
const app = express();
const dotenv = require("dotenv");
app.use(express.json())
dotenv.config();
const cors = require("cors");
const mongoose = require("mongoose");
const options = {
  origin: "http://localhost:3000",
};
app.use(cors());

//routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

//database
mongoose
.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
})
.then(() => console.log("database connected"))
.catch((err) => console.log("mongoose connection error", err));

app.listen(process.env.PORT, () => {
  console.log("listening on port 8000");
});