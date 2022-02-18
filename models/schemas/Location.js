const mongoose = require("mongoose");

const loactionSchema = new mongoose.Schema({
  instrument: {
    type: Schema.Types.ObjectId,
    ref: "Instrument",
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
});

const Location = mongoose.model("Location", loactionSchema);

module.exports = Location;
