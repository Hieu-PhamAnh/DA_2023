const express = require('express');
const authRouter = express.Router();

const authController = require('../controller/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const userMiddleware = require('../middleware/user.middleware');

authRouter.post(
  '/login',
  userMiddleware.checkRequiredLogin,
  authController.login,
); // trả về token
// authRouter.post("/loginGoogle", authController.loginGoogle);
authRouter.post(
  '/logout',
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  authController.logout,
); // need token
authRouter.post(
  '/refresh-token',
  authMiddleware.checkRequired,
  authMiddleware.verifiyRFToken,
  authController.refreshToken,
); // need refresh token

module.exports = authRouter;
