const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    content: { type: String, default: "" },
  },
  {
    timestamps: true,
    versionKey: false, // disable versionKey
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
