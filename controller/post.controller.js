const mongoose = require('mongoose');
const Notification_Const = require('../constants/notification.constants');
const Notification = require('../model/Notification');
const User = require('../model/User');
const Post = require('../model/Post');
const Comment = require('../model/Comment');

const PostController = {
  createPost: async (req, res) => {
    try {
      const { verify_id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const newPost = await Post.create({
        author: user._id,
        content: req.body.content,
        images: [],
      });
      return res.status(200).json({
        message: 'Tạo bai viet thành công',
        data: newPost,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  // get posts: pagination, sort, filter

  getPosts: async (req, res) => {
    try {
      const { verify_id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const posts = await Post.aggregate([
        { $match: { author: user._id } },
        { $limit: req.query.limit || 10 },
        { $skip: (req.query.limit || 10) * (req.query.page || 0) },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);
      console.log();
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

  getFeed: async (req, res) => {
    try {
      const { verify_id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const posts = await Post.aggregate([
        { $match: { author: { $in: user.friends } } },
        { $limit: req.query.limit || 10 },
        { $skip: (req.query.limit || 10) * (req.query.page || 0) },
        {
          $lookup: {
            from: 'users', // Assuming your users collection is named 'users'
            localField: 'author',
            foreignField: '_id',
            as: 'authorData',
          },
        },
        {
          $unwind: '$authorData',
        },
        {
          $project: {
            _id: 1,
            author: {
              _id: '$authorData._id',
              firstName: '$authorData.firstName',
              lastName: '$authorData.lastName',
              avatar: '$authorData.avatar',
            },
            content: 1,
            images: 1,
            reactions: 1,
            comments: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);
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

  getPostById: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'users', // Assuming your users collection is named 'users'
            localField: 'author',
            foreignField: '_id',
            as: 'authorData',
          },
        },
        {
          $unwind: '$authorData',
        },
        {
          $project: {
            _id: 1,
            author: {
              _id: '$authorData._id',
              firstName: '$authorData.firstName',
              lastName: '$authorData.lastName',
              avatar: '$authorData.avatar',
            },
            content: 1,
            images: 1,
            reactions: 1,
            comments: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);

      // const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
        });
      }
      return res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  deletePostById: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findByIdAndDelete(id);
      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
        });
      }
      return res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  updatePostById: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findByIdAndUpdate(id, {
        content: req.body.content,
      });
      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
        });
      }
      return res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  react: async (req, res) => {
    try {
      const { id } = req.params;
      const { verify_id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
        });
      }
      if (post.reactions.includes(user._id)) {
        await post.updateOne({ $pull: { reactions: user._id } });
      } else {
        await post.updateOne({ $push: { reactions: user._id } });
      }
      return res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  comment: async (req, res) => {
    try {
      const { id } = req.params;
      const { verify_id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
        });
      }
      // author: { type: Schema.Types.ObjectId, ref: "User" },
      // post: { type: Schema.Types.ObjectId, ref: "Post" },
      // content: { type: String, default: "" },
      const newComment = await Comment.create({
        author: user._id,
        post: post._id,
        content: req.body.content,
      });
      await post.updateOne({ $push: { comments: newComment._id } }).exec();
      return res.status(200).json({
        success: true,
        data: newComment,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  getAllComment: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
        });
      }
      const comments = await Comment.aggregate([
        { $match: { post: post._id } },
        {
          $lookup: {
            from: 'users', // Assuming your users collection is named 'users'
            localField: 'author',
            foreignField: '_id',
            as: 'authorData',
          },
        },
        {
          $unwind: '$authorData',
        },
        {
          $project: {
            _id: 1,
            author: {
              _id: '$authorData._id',
              firstName: '$authorData.firstName',
              lastName: '$authorData.lastName',
              avatar: '$authorData.avatar',
            },
            post: 1,
            content: 1,
            createdAt: 1,
            // updatedAt: 1,
          },
        },
      ]);
      return res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },
};

module.exports = PostController;
