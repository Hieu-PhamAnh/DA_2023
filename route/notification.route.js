const express = require('express');
const notificationRouter = express.Router();
const NotificationController = require('../controller/notification.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateMiddleware = require('../middleware/validate.middleware');

notificationRouter.get('/', NotificationController.getNotifications);
notificationRouter.patch('/read-all', NotificationController.readAll);
notificationRouter.patch(
  '/:id',
  validateMiddleware.checkValidId,
  NotificationController.read,
);

module.exports = notificationRouter;
