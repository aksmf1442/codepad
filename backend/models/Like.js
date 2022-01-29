const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  preset: {
    type: Schema.Types.ObjectId,
    ref: "Preset",
    required: true,
  },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = { Like };
