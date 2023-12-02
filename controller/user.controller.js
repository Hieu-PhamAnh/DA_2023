const User = require("../model/User");
const mongoose = require("mongoose");

const UserController = {
  create: async (req, res) => {
    try {
      const newUser = await User.create(req.body);
      return res.status(200).json({
        message: "Tạo tài khoản thành công",
        user: newUser,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
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
                $count: "docs",
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
      // console.log("Van chay");
      if (data[0].count.length > 0) {
        return res.status(200).json({
          message: "Thành công",
          "tổng số user": data[0].count[0].docs,
          data: data[0].users,
        });
      }
      if (data[0].count.length) {
        return res.status(404).json({
          message: "Not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
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
          message: "Thành công",
          user: data,
        });
      }
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
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
          message: "Sửa thông tin thành công",
          user: data,
        });
      }
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
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
          message: "Xoá người dùng thành công",
          // user: data,
        });
      }
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
        error: error,
      });
    }
  },

  getByUsername: async (req, res) => {
    try {
      const { page, limit, username } = req.query;
      const matchStage = {
        $match: {
          username: {
            $regex: new RegExp(username, "i"), // "i" for case-insensitive
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
                $count: "docs",
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
        data: data,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Server error",
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
          message: "Người dùng không tồn tại",
        });
      }

      user.mainAva = newAvatar;
      await user.save();

      return res.status(200).json({
        message: "Đổi ảnh đại diện thành công",
        user: user,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
        error: error,
      });
    }
  },

  /**
   *   User friends
   */
  getUserFriends: async (req, res) => {
    try {
      const { id } = req.body;
      console.log(id);
      const user = await User.findById(id);
      // const userId = mongoose.Types.ObjectId(id);
      // console.log(userId);
      const pipeline = [
        { _id: { $in: user.friends } },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            avatar: 1,
          },
        },
      ];
      console.log("van chay");
      const friends = await User.aggregate(pipeline);
      return res.status(200).json({
        success: true,
        data: friends,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
        error: error,
      });
    }
  },

  /**
   *   User posts
   */
};

module.exports = UserController;