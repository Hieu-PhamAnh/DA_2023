const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessageAt: { type: Date },
    messages: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false, // disable versionKey
  }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
