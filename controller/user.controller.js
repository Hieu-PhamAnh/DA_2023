const mongoose = require('mongoose');
const Notification_Const = require('../constants/notification.constants');
const Notification = require('../model/Notification');
const User = require('../model/User');
const Post = require('../model/Post');

const UserController = {
  create: async (req, res) => {
    try {
      const newUser = await User.create(req.body);
      return res.status(200).json({
        message: 'Tạo tài khoản thành công',
        user: newUser,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },
  getAllUser: async (req, res) => {
    try {
      const { page, limit } = req.query;
      // console.log(page, limit);
      const pipeline = [
        {
          $match: {},
        },
        {
          $project: {
            password: 0,
            // _id: 0,
            // createdAt: 0,
            // updatedAt: 0,
          },
        },
        {
          $facet: {
            count: [
              {
                $count: 'docs',
              },
            ],
            users: [
              {
                $skip: (Number(page - 1) || 0) * (Number(limit) || 10), //page * limit,
              },
              {
                $limit: Number(limit) || 10, //limit,
              },
            ],
          },
        },
      ];
      const data = await User.aggregate(pipeline);
      // console.log("Van chay");
      if (data[0].count.length > 0) {
        return res.status(200).json({
          message: 'Thành công',
          'tổng số user': data[0].count[0].docs,
          data: data[0].users,
        });
      }
      if (data[0].count.length) {
        return res.status(404).json({
          message: 'Not found',
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },
  getUserByID: async (req, res) => {
    try {
      const { id } = req.params;
      // const id = req.body.verify_id;
      // console.log(id);
      const data = await User.findById(id);
      if (data) {
        return res.status(200).json({
          message: 'Thành công',
          user: data,
        });
      }
      return res.status(404).json({
        message: 'Người dùng không tồn tại',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await User.findByIdAndUpdate(id, req.body);
      if (data) {
        return res.status(200).json({
          message: 'Sửa thông tin thành công',
          user: data,
        });
      }
      return res.status(404).json({
        message: 'Người dùng không tồn tại',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await User.findByIdAndDelete(id);
      if (data) {
        return res.status(200).json({
          message: 'Xoá người dùng thành công',
          // user: data,
        });
      }
      return res.status(404).json({
        message: 'Người dùng không tồn tại',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  /**
   * Search users
   */

  getByUsername: async (req, res) => {
    try {
      const { page, limit, username } = req.query;
      const matchStage = {
        $match: {
          username: {
            $regex: new RegExp(username, 'i'), // "i" for case-insensitive
          },
        },
      };
      const pipeline = [
        matchStage,
        {
          $project: {
            password: 0,
          },
        },
        {
          $facet: {
            count: [
              {
                $count: 'docs',
              },
            ],
            users: [
              {
                $skip: Number(page - 1) * Number(limit), //page * limit,
              },
              {
                $limit: Number(limit), //limit,
              },
            ],
          },
        },
      ];
      const data = await User.aggregate(pipeline);

      return res.status(200).json({
        success: true,
        data: data[0].users,
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  /**
   *   User avatar
   */
  // chua fix
  changeAvatar: async (req, res) => {
    try {
      const { id } = req.params;
      const { newAvatar } = req.body;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          message: 'Người dùng không tồn tại',
        });
      }

      user.mainAva = newAvatar;
      await user.save();

      return res.status(200).json({
        message: 'Đổi ảnh đại diện thành công',
        user: user,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  /**
   *   User friends
   */
  getUserFriends: async (req, res) => {
    try {
      const { verify_id } = req.body;
      // console.log(mongoose.Types.ObjectId.isValid(id));
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const pipeline = [
        { $match: { _id: { $in: user.friends } } },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            avatar: 1,
          },
        },
      ];
      const friends = await User.aggregate(pipeline);
      return res.status(200).json({
        success: true,
        data: friends,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  deleteFriend: async (req, res) => {
    try {
      const { verify_id } = req.body;
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id in body',
        });
      }
      const user = await User.findById(verify_id);
      const friend = await User.findById(id);
      if (!friend) {
        return res.status(404).json({
          message: 'user not found',
        });
      }
      if (!user.friends.includes(friend._id)) {
        return res.status(400).json({
          message: 'You are not friend',
        });
      }
      /**
       *   Cach 1
       */
      // user.friends.pull(friend._id),
      //   friend.friends.pull(user._id),
      //   await user.save(),
      //   await friend.save(),

      /**
       *   Cach 2
       */
      await Promise.all([
        user.updateOne({ $pull: { friends: friend._id } }).exec(),
        friend.updateOne({ $pull: { friends: user._id } }).exec(),
      ]);

      /**
       *   Cách 3
       *   update: 2 cách trên chay khi
       *   array friends lưu các giá trị objectId thay vi string
       */
      // user.friends.pull(friend._id),
      //   friend.friends.pull(user._id),
      //   await User.findByIdAndUpdate(user._id, { friends: user.friends });
      // await User.findByIdAndUpdate(friend._id, { friends: friend.friends });

      // console.log(user.friends, friend.friends);
      return res.status(200).json({
        success: true,
        message: 'Unfriended success',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  addFriend: async (req, res) => {
    try {
      const { verify_id, friend_id } = req.body;
      if (
        !mongoose.Types.ObjectId.isValid(verify_id) ||
        !mongoose.Types.ObjectId.isValid(friend_id)
      ) {
        return res.status(400).json({
          message: 'invalid id in body',
        });
      }
      const user = await User.findById(verify_id);
      const friend = await User.findById(friend_id);
      if (!friend) {
        return res.status(404).json({
          message: 'user not found',
        });
      }
      if (friend_id === verify_id) {
        return res.status(400).json({
          message: 'You can not add yourself as a friend',
        });
      }
      if (user.friends.includes(friend._id)) {
        return res.status(400).json({
          message: 'Both of you are friends',
        });
      }
      if (user.incomingFriendRequests.includes(friend._id)) {
        await Promise.all([
          user
            .updateOne({
              $pull: { incomingFriendRequests: friend._id },
              $push: { friends: friend._id },
            })
            .exec(),
          friend
            .updateOne({
              $push: { friends: user._id },
            })
            .exec(),
        ]);
        await Notification.create({
          actor: user,
          target: friend,
          action: Notification_Const.NOTIFICATION_ACTIONS.ACCEPT_FRIEND_REQUEST,
        });
        return res.status(200).json({
          success: true,
          message: 'Friend request accepted',
        });
      }
      if (friend.incomingFriendRequests.includes(user._id)) {
        return res.status(400).json({
          message: 'Friend request already sent',
        });
      }
      await friend
        .updateOne({
          $push: { incomingFriendRequests: user._id },
        })
        .exec();
      await Notification.create({
        actor: user,
        target: friend,
        action: Notification_Const.NOTIFICATION_ACTIONS.SEND_FRIEND_REQUEST,
      });
      return res.status(200).json({
        success: true,
        message: 'Friend request sent success',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  getFriendRequests: async (req, res) => {
    try {
      const { verify_id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id in body',
        });
      }
      const user = await User.findById(verify_id);
      const pipeline = [
        { $match: { _id: { $in: user.incomingFriendRequests } } },
        {
          $project: {
            _id: 1,
            username: 1,
            firstName: 1,
            lastName: 1,
            avatar: 1,
          },
        },
        // {
        //   populate: {
        //     path: 'avatar',
        //     model: Attachment.name,
        //     select: ['_id', 'mimetype'],
        //   },
        // },
      ];
      const requests = await User.aggregate(pipeline);
      return res.status(200).json({
        success: true,
        date: requests,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  delteFriendRequest: async (req, res) => {
    try {
      const { verify_id, friend_id } = req.body;
      if (
        !mongoose.Types.ObjectId.isValid(verify_id) ||
        !mongoose.Types.ObjectId.isValid(friend_id)
      ) {
        return res.status(400).json({
          message: 'invalid id in body',
        });
      }
      const user = await User.findById(verify_id);
      const friend = await User.findById(friend_id);
      if (!friend) {
        return res.status(404).json({
          message: 'user not found',
        });
      }
      if (user.incomingFriendRequests.includes(friend._id)) {
        await user
          .updateOne({ $pull: { incomingFriendRequests: friend._id } })
          .exec();
      } else if (friend.incomingFriendRequests.includes(user._id)) {
        await friend
          .updateOne({ $pull: { incomingFriendRequests: user._id } })
          .exec();
      } else {
        return res.status(400).json({
          message: 'Friend request not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Friend request deleted success',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },
  /**
   *   User posts
   */
  getUserPosts: async (req, res) => {
    try {
      const { verify_id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const pipeline = [
        { $match: { author: user._id } },
        // {
        //   sort: {
        //     createdAt: -1,
        //   },
        // },
        // {
        //   limit: query.limit || 10,
        //   skip: (query.limit || 10) * (query.page - 1 || 0),
        //   sort: {
        //     createdAt: -1,
        //   },
        // },

        // {
        //   $facet: {
        //     count: [
        //       {
        //         $count: 'docs',
        //       },
        //     ],
        //     users: [
        //       {
        //         $skip: (Number(page - 1) || 0) * (Number(limit) || 10), //page * limit,
        //       },
        //       {
        //         $limit: Number(limit) || 10, //limit,
        //       },
        //     ],
        //   },
        // },
      ];
      const posts = await Post.aggregate(pipeline);
      return res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },
};

module.exports = UserController;
