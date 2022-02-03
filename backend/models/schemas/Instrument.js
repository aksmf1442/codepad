const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const instrumentSchema = new mongoose.Schema({
  preset: {
    type: Schema.Types.ObjectId,
    ref: "Preset",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sound: {
    type: Schema.Types.ObjectId,
    ref: "SoundSample",
    required: true,
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  buttonType: {
    type: String,
    required: true,
  },
  playType: {
    type: String,
    required: true,
  },
});

const Instrument = mongoose.model("Instrument", instrumentSchema);

module.exports = Instrument;
