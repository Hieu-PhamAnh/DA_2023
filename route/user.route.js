const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/user.controller');
const userMiddleware = require('../middleware/user.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const validateMiddleware = require('../middleware/validate.middleware');

userRouter.post(
  '/',
  userMiddleware.checkRequire,
  userMiddleware.checkExist,
  userController.create,
);
userRouter.post('/friend-requests', userController.addFriend);
userRouter.get('/', validateMiddleware.checkQuerry, userController.getAllUser);
userRouter.get(
  '/search',
  validateMiddleware.checkQuerry,
  userController.getByUsername,
);
userRouter.get('/friends', userController.getUserFriends);
userRouter.get('/friend-requests', userController.getFriendRequests);
userRouter.get('/posts', userController.getUserPosts);
userRouter.delete('/friend-requests', userController.delteFriendRequest);
userRouter.delete(
  '/friends/:id',
  validateMiddleware.checkValidId,
  userController.deleteFriend,
);
userRouter.get(
  '/:id',
  validateMiddleware.checkValidId,
  userController.getUserByID,
);
userRouter.patch(
  '/:id',
  validateMiddleware.checkValidId,
  userController.update,
);
userRouter.delete(
  '/:id',
  validateMiddleware.checkValidId,
  userController.delete,
);
module.exports = userRouter;
