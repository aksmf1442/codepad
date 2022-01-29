const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const tagSchema = new mongoose.Schema({
  preset: {
    type: Schema.Types.ObjectId,
    ref: "Preset",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = { Tag };
