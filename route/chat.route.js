const express = require('express');
const chatRouter = express.Router();
const ChatController = require('../controller/chat.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateMiddleware = require('../middleware/validate.middleware');

chatRouter.post(
  '/',
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  ChatController.createChatBox,
);
// need token, cần friend_id
// tao boxchat hoac lay ra cai co san
chatRouter.get(
  '/',
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  ChatController.getChatBoxs,
);
// need token
// lay ra tat ca boxchat cua nguoi dung
chatRouter.get(
  '/:id/messages',
  validateMiddleware.checkValidId,
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  ChatController.getMessageByBoxchatId,
);
// need token
// lay ra tin nhan trong boxchat theo boxchat id
// chua test
chatRouter.delete(
  '/:id',
  validateMiddleware.checkValidId,
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  ChatController.deleteBoxchat,
);
// need token
// thoat box chat

module.exports = chatRouter;
