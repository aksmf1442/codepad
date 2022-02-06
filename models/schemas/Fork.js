const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const forkSchema = new mongoose.Schema({
  preset: {
    type: Schema.Types.ObjectId,
    ref: "Preset",
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const Fork = mongoose.model("Fork", forkSchema);

module.exports = Fork;
