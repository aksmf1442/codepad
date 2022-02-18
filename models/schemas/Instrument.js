const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const instrumentSchema = new mongoose.Schema({
  preset: {
    type: Schema.Types.ObjectId,
    ref: "Preset",
    required: true,
  },
  soundSample: {
    type: Schema.Types.ObjectId,
    ref: "SoundSample",
    required: true,
  },
  xCoordinate: {
    type: String,
    required: true,
  },
  yCoordinate: {
    type: String,
    required: true,
  },
  buttonType: {
    type: String,
    required: true,
  },
  soundType: {
    type: String,
    required: true,
  },
});

const Instrument = mongoose.model("Instrument", instrumentSchema);

module.exports = Instrument;
