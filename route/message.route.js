const express = require('express');
const messageRouter = express.Router();
const ChatController = require('../controller/chat.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateMiddleware = require('../middleware/validate.middleware');

messageRouter.post('/', ChatController.createMessage);
// need token, cần verify_id và boxchat_id

module.exports = messageRouter;
