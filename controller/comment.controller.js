const mongoose = require('mongoose');
const Notification_Const = require('../constants/notification.constants');
const Notification = require('../model/Notification');
const User = require('../model/User');
const Post = require('../model/Post');
const Comment = require('../model/Comment');

const CommentController = {
  deleteComment: async (req, res) => {
    try {
      const { verify_id } = req.body;
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const comment = await Comment.findOne({ _id: id, author: user._id });
      if (!comment) {
        return res.status(404).json({
          message: 'Comment not found',
        });
      }
      const post = await Post.findById(comment.post);
      if (post) {
        post.updateOne({ $pull: { comments: comment._id } }).exec();
      }
      await comment.deleteOne();
      return res.status(200).json({
        message: 'Xoa cmt thanh cong',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  // get posts: pagination, sort, filter
};

module.exports = CommentController;
