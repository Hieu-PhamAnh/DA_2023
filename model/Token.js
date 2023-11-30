const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId },
    token: { type: String },
  },
  {
    timestamps: true,
  },
  {
    versionKey: false, // disable versionKey
  }
);

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
