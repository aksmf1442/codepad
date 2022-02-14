const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const commentSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  preset: {
    type: Schema.Types.ObjectId,
    ref: "Perset",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
