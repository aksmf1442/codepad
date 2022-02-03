const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const visitSchema = new mongoose.Schema({
  preset: {
    type: Schema.Types.ObjectId,
    ref: "Preset",
    required: true,
  },
  user: {
    type: Number,
    required: true,
  },
});

const Visit = mongoose.model("Visit", visitSchema);

module.exports = { Visit };
