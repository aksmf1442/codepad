const mongoose = require("mongoose");

const connectDB = (url) => {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection.on("connected", () => {
    console.log("connected to MongoDB");
  });
};

module.exports = connectDB;
