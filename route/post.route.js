const express = require('express');
const postRouter = express.Router();
const PostController = require('../controller/post.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateMiddleware = require('../middleware/validate.middleware');

postRouter.post('/', PostController.createPost); // tao bai viet
postRouter.get('/all', PostController.getPosts); // get all bai viet cua user
postRouter.get('/feed', PostController.getFeed); // get news feed
postRouter.get(
  '/:id',
  validateMiddleware.checkValidId,
  PostController.getPostById,
); // get post by id
postRouter.delete(
  '/:id',
  validateMiddleware.checkValidId,
  PostController.deletePostById,
); // delete post by id
postRouter.patch(
  '/:id',
  validateMiddleware.checkValidId,
  PostController.updatePostById,
); // update post by id

// api react post
postRouter.post(
  '/:id/react',
  validateMiddleware.checkValidId,
  PostController.react,
); // react post

// api comment post
postRouter.post(
  '/:id/comment',
  validateMiddleware.checkValidId,
  PostController.comment,
); // comment post

postRouter.get(
  '/:id/comment',
  validateMiddleware.checkValidId,
  PostController.getAllComment,
); // get post comments
module.exports = postRouter;
