const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {},
  {
    timestamps: true,
  },
  {
    versionKey: false, // disable versionKey
  }
);

const SportProfile = mongoose.model("SportProfile", profileSchema);
module.exports = SportProfile;
