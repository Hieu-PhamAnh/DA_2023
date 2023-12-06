const express = require('express');
const profileRouter = express.Router();
const ProfileController = require('../controller/sport.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateMiddleware = require('../middleware/validate.middleware');

profileRouter.post('/', ProfileController.create); // can verify_id
profileRouter.post('/match', ProfileController.match);
profileRouter.get(
  '/:id',
  validateMiddleware.checkValidId,
  ProfileController.getProfileById,
);
profileRouter.patch(
  '/:id',
  validateMiddleware.checkValidId,
  ProfileController.updateProfileById,
);

module.exports = profileRouter;
