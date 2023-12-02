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
userRouter.get("/", userController.getAllUser);
userRouter.get("/search", userController.getByUsername);
userRouter.get("/friends", userController.getUserFriends);
userRouter.get("/:id", userController.getUserByID);
userRouter.patch("/:id", userController.update);
userRouter.delete("/:id", userController.delete);
module.exports = userRouter;
