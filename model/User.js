const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: { type: String, require: true },
    password: { type: String, require: true, min: 8 },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    gender: { type: String, default: '' },
    avatar: { type: String, default: 'avatar.png' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    birthday: { type: Date, default: null },
    joinedAt: { type: Date, default: new Date() },
    bio: { type: String, default: '' },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    incomingFriendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    versionKey: false,
  },
);

const User = mongoose.model('User', userSchema);
module.exports = User;
