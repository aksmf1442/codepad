const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const presetSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  isPrivate: {
    type: Boolean,
    required: true,
  },
  thumbnailURL: {
    type: String,
  },
  size: {
    type: Number,
  },
});

const Preset = mongoose.model("Preset", presetSchema);

module.exports = Preset;
