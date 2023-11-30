const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notiSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User", default: null },
    target: { type: Schema.Types.ObjectId, ref: "User", default: null },
    action: { type: String, default: null },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
  {
    versionKey: false, // disable versionKey
  }
);

const Notification = mongoose.model("Notification", notiSchema);
module.exports = Notification;
