const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const presetSchema = new mongoose.Schema(
  {
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
    size: {
      type: Number,
      required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    thumbnailURL: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Preset = mongoose.model("Preset", presetSchema);

module.exports = Preset;
