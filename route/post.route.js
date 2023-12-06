const express = require('express');
const postRouter = express.Router();
const PostController = require('../controller/post.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateMiddleware = require('../middleware/validate.middleware');

postRouter.post(
  '/',
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  PostController.createPost,
); // tao bai viet, need token

postRouter.get(
  '/all',
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  PostController.getPosts,
); // get all bai viet cua user, need token

postRouter.get(
  '/feed',
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  PostController.getFeed,
); // get news feed, need token

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
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  PostController.react,
); // react post, need token

// api comment post
postRouter.post(
  '/:id/comment',
  validateMiddleware.checkValidId,
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  PostController.comment,
); // comment post, need token

postRouter.get(
  '/:id/comment',
  validateMiddleware.checkValidId,
  PostController.getAllComment,
); // get post comments
module.exports = postRouter;
