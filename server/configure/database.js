const mongoose = require("mongoose");
require("dotenv").config();

function databaseConnect() {
  mongoose
    .connect("mongodb://localhost:27017/RTCCE", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ Connection Error:", err));
  console.log("mongodb://localhost:27017/RTCCE");
}

module.exports = databaseConnect;
