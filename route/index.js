const express = require('express');
const router = express.Router();
const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const postRouter = require('./post.route');
const notificationRouter = require('./notification.route');
const commentRouter = require('./comment.route');
const chatRouter = require('./chat.route');
const messageRouter = require('./message.route');

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/posts', postRouter);
router.use('/notifications', notificationRouter);
router.use('/comments', commentRouter);
router.use('/chats', chatRouter);
router.use('/messages', messageRouter);

module.exports = router;
