const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  thumbnailURL: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
