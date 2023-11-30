const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    time: { type: Date, default: new Date() },
    from: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
  {
    versionKey: false, // disable versionKey
  }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
