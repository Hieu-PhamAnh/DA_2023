const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/user.controller");
const userMiddleware = require("../middleware/user.middleware");
const authMiddleware = require("../middleware/auth.middleware");

userRouter.post(
  "/",
  userMiddleware.checkRequire,
  userMiddleware.checkExist,
  userController.create
);

module.exports = userRouter;
