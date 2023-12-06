const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/user.controller');
const userMiddleware = require('../middleware/user.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const validateMiddleware = require('../middleware/validate.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest;
    if (file.fieldname === 'images') {
      dest = path.join(__dirname, '../public/images');
    }
    fs.mkdirsSync(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const filename = `${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });
const cpUpload = upload.fields([{ name: 'images', maxCount: 10 }]);

userRouter.post('/upload', cpUpload, (req, res) => {
  // console.log(req.files.images[0].originalname);
  return res.status(200).json({
    message: 'Upload success',
    filename: req.files.images[0].originalname,
  });
});

userRouter.post(
  '/',
  userMiddleware.checkRequire,
  userMiddleware.checkExist,
  userController.create,
); // tao tai khoan
userRouter.post(
  '/friend-requests',
  // authMiddleware.checkRequired,
  // authMiddleware.verifiyToken,
  userController.addFriend,
); // gui loi moi ket ban
userRouter.get('/', validateMiddleware.checkQuerry, userController.getAllUser);
// get all user
userRouter.get(
  '/search',
  validateMiddleware.checkQuerry,
  userController.getByUsername,
); // search by username
userRouter.get(
  '/friends',
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  userController.getUserFriends,
); // get user friends
userRouter.get(
  '/friend-requests',
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  userController.getFriendRequests,
); // get user friend request
userRouter.get(
  '/posts',
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  userController.getUserPosts,
); // get user posts
userRouter.delete(
  '/friend-requests',
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  userController.delteFriendRequest,
); // xoa friend request (can verify id va friend id)
userRouter.delete(
  '/friends/:id',
  validateMiddleware.checkValidId,
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  userController.deleteFriend,
); // xoa ban (can verify id va friend id trong params)
userRouter.get(
  '/:id',
  validateMiddleware.checkValidId,
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  userController.getUserByID,
); // get user by id
userRouter.patch(
  '/:id',
  validateMiddleware.checkValidId,
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  userController.update,
); // update profile
userRouter.delete(
  '/:id',
  validateMiddleware.checkValidId,
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  userController.delete,
); // xoa user
module.exports = userRouter;
