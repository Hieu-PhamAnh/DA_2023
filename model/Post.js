const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    images: [{ type: String }],
    reactions: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    comments: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
  {
    versionKey: false, // disable versionKey
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
