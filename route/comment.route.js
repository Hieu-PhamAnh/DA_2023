const express = require('express');
const commentRouter = express.Router();
const CommentController = require('../controller/comment.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateMiddleware = require('../middleware/validate.middleware');

commentRouter.delete(
  '/:id',
  validateMiddleware.checkValidId,
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  CommentController.deleteComment,
); // need token

module.exports = commentRouter;
