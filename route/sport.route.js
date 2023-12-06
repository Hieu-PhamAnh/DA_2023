const express = require('express');
const profileRouter = express.Router();
const ProfileController = require('../controller/sport.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateMiddleware = require('../middleware/validate.middleware');

profileRouter.post(
  '/',
  authMiddleware.checkRequired,
  authMiddleware.verifiyToken,
  ProfileController.create,
); // need verify_id
profileRouter.post('/match', ProfileController.match); // match nguoi dung
profileRouter.get(
  '/:id',
  validateMiddleware.checkValidId,
  ProfileController.getProfileById,
); // get profile by id

profileRouter.patch(
  '/:id',
  validateMiddleware.checkValidId,
  ProfileController.updateProfileById,
); // update profile by id

module.exports = profileRouter;
