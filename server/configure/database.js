const mongoose = require("mongoose");
require("dotenv").config();
const MONGOURI = process.env.MONGO_URI || "mongodb://localhost:27017/RTCCE"

function databaseConnect() {
  mongoose
    .connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ Connection Error:", err));
  // console.log("the mongodb connected with the url",MONGOURI);
}

module.exports = databaseConnect;
