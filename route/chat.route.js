const express = require('express');
const chatRouter = express.Router();
const ChatController = require('../controller/chat.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateMiddleware = require('../middleware/validate.middleware');

chatRouter.post('/', ChatController.createChatBox);
// tao boxchat hoac lay ra cai co san
chatRouter.get('/', ChatController.getChatBoxs);
// lay ra tat ca boxchat cua nguoi dung
chatRouter.get(
  '/:id/messages',
  validateMiddleware.checkValidId,
  ChatController.getMessageByBoxchatId,
);
// lay ra tin nhan trong boxchat theo boxchat id
// chua test
chatRouter.delete(
  '/:id',
  validateMiddleware.checkValidId,
  ChatController.deleteBoxchat,
);
// thoat box chat

module.exports = chatRouter;
