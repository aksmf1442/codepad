const mongoose = require("mongoose");

const soundSampleSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
  },
  URL: {
    type: String,
    required: true,
  },
});

const SoundSample = mongoose.model("SoundSample", soundSampleSchema);

module.exports = { SoundSample };
