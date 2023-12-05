const mongoose = require('mongoose');
const Notification_Const = require('../constants/notification.constants');
const Notification = require('../model/Notification');
const User = require('../model/User');
const Post = require('../model/Post');
const Comment = require('../model/Comment');
const Chat = require('../model/Chat');
const Message = require('../model/Message');

const ChatController = {
  createChatBox: async (req, res) => {
    try {
      const { verify_id, friend_id } = req.body;
      if (
        !mongoose.Types.ObjectId.isValid(verify_id) ||
        !mongoose.Types.ObjectId.isValid(friend_id)
      ) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const friend = await User.findById(friend_id);
      if (!friend) {
        return res.status(404).json({
          message: 'user not found',
        });
      }
      const check = await Chat.aggregate([
        {
          $match: {
            participants: { $all: [user._id, friend._id], $size: 2 },
          },
        },
      ]);
      // console.log(check);
      if (check.length > 0) {
        return res.status(200).json({
          message: 'Box chat have existed',
          boxchat: check,
        });
      }
      const boxchat = await Chat.create({
        participants: [user._id, friend._id],
        lastMessageAt: new Date(),
      });
      return res.status(200).json({
        message: 'Box chat created',
        boxchat: boxchat,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  getChatBoxs: async (req, res) => {
    try {
      const { verify_id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const boxchats = await Chat.aggregate([
        // {
        //   $match: {
        //     participants: { $in: [user._id] },
        //   },
        // },
        // {
        //   $project: {
        //     createdAt: 0,
        //     updatedAt: 0,
        //   },
        // },
        // {
        //   $sort: { lastMessageAt: -1 },
        // },

        {
          $match: {
            participants: { $in: [user._id] },
          },
        },
        {
          $lookup: {
            from: 'users', // Assuming your users collection is named 'users'
            localField: 'participants',
            foreignField: '_id',
            as: 'participantsData',
          },
        },
        {
          $unwind: '$participantsData',
        },
        {
          $project: {
            _id: 1,
            lastMessageAt: 1,
            participantsData: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              avatar: 1,
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            lastMessageAt: { $first: '$lastMessageAt' },
            participants: { $push: '$participantsData' },
          },
        },
        {
          $sort: { lastMessageAt: -1 },
        },
      ]);
      // console.log('van chay');
      return res.status(200).json({
        success: true,
        boxchat: boxchats,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  getMessageByBoxchatId: async (req, res) => {
    try {
      const { id } = req.params;
      const { verify_id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const boxchat = await Chat.findById(id);
      const messages = await Message.aggregate([
        { $match: { _id: { $in: boxchat.messages } } },
        {
          $sort: { time: -1 },
        },
      ]);
      return res.status(200).json({
        success: true,
        boxchat: boxchat,
        messages: messages,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },
  deleteBoxchat: async (req, res) => {
    try {
      const { id } = req.params;
      const { verify_id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const boxchat = await Chat.findById(id);
      // console.log(boxchat);
      if (!boxchat) {
        return res.status(404).json({
          message: 'Box chat not found',
        });
      }
      await boxchat.updateOne({
        $pull: { participants: user._id },
      });
      return res.status(200).json({
        success: true,
        boxchat: boxchat,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  // message controller
  createMessage: async (req, res) => {
    try {
      // time: { type: Date, default: new Date() },
      // from: { type: Schema.Types.ObjectId, ref: "User" },
      // content: { type: String, default: "" },
      const { verify_id, boxchat_id } = req.body;
      if (
        !mongoose.Types.ObjectId.isValid(verify_id) ||
        !mongoose.Types.ObjectId.isValid(boxchat_id)
      ) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const boxchat = await Chat.findById(boxchat_id);
      if (!boxchat) {
        return res.status(404).json({
          message: 'Box chat not found',
        });
      }
      const newMessage = await Message.create({
        from: user._id,
        content: req.body.content,
      });
      await boxchat.updateOne({
        $push: { messages: newMessage._id },
      });
      return res.status(200).json({
        success: true,
        message: newMessage,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },
};

module.exports = ChatController;
