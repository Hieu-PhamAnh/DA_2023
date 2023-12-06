const express = require('express');
const notificationRouter = express.Router();
const NotificationController = require('../controller/notification.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateMiddleware = require('../middleware/validate.middleware');

notificationRouter.get(
  '/',
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  NotificationController.getNotifications,
); // need token

notificationRouter.patch(
  '/read-all',
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  NotificationController.readAll,
); // need token

notificationRouter.patch(
  '/:id',
  validateMiddleware.checkValidId,
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  NotificationController.read,
); // need token

module.exports = notificationRouter;
