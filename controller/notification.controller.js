const mongoose = require('mongoose');
const Notification_Const = require('../constants/notification.constants');
const Notification = require('../model/Notification');
const User = require('../model/User');
const Post = require('../model/Post');
const Comment = require('../model/Comment');

const NotificationController = {
  getNotifications: async (req, res) => {
    try {
      const { verify_id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const pipeline = [
        { $match: { target: user._id } },
        { $sort: { createdAt: -1 } }, // Corrected: $sort should be part of the pipeline
        {
          $lookup: {
            from: 'users', // Adjust the collection name if necessary
            localField: 'actor',
            foreignField: '_id',
            as: 'actor',
          },
        },
        { $unwind: '$actor' }, // If 'actor' is an array after the $lookup, $unwind to destructure it
        {
          $project: {
            _id: 1,
            createdAt: 1,
            action: 1,
            // contentId: 1,
            isRead: 1,
            'actor._id': 1,
            'actor.firstName': 1,
            'actor.lastName': 1,
            'actor.avatar': 1,
          },
        },
      ];
      const data = await Notification.aggregate(pipeline);
      return res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },
  readAll: async (req, res) => {
    try {
      const { verify_id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const data = await Notification.updateMany(
        {
          target: user._id,
          isRead: false,
        },
        {
          isRead: true,
        },
      );
      return res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },
  read: async (req, res) => {
    try {
      const { verify_id } = req.body;
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const data = await Notification.updateMany(
        {
          _id: id,
          target: user._id,
          isRead: false,
        },
        {
          isRead: true,
        },
      );
      return res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },
};

module.exports = NotificationController;
