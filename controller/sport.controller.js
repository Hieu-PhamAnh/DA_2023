const mongoose = require('mongoose');
const Notification_Const = require('../constants/notification.constants');
const Sport_Const = require('../constants/position.constants');
const Notification = require('../model/Notification');
const User = require('../model/User');
const Profile = require('../model/SportProfile');
const axios = require('axios');

const ProfileController = {
  create: async (req, res) => {
    try {
      const { verify_id } = req.body;
      if (!mongoose.Types.ObjectId.isValid(verify_id)) {
        return res.status(400).json({
          message: 'invalid id',
        });
      }
      const user = await User.findById(verify_id);
      const check = await Profile.findOne({ user: user._id });
      if (check) {
        return res.status(200).json({
          message: 'Bạn đã có sport profile',
          data: check,
        });
      }
      let position = '';
      let stats = Sport_Const.STAT.map((key) => Number(req.body[key]));
      //   console.log(stats);
      await axios
        .post(`http://localhost/predict`, {
          stats,
        })
        .then(async (response) => {
          position = response.data.position;
        })
        .catch(function (err) {
          return res.status(500).json({
            message: 'Server error at machine learning model',
            error: err,
          });
        });
      position = Sport_Const.POSITION[position];

      const newProfile = await Profile.create({
        user: user._id,
        position: position,
        Crossing: req.body.Crossing,
        Finishing: req.body.Finishing,
        Heading: req.body.Heading,
        ShortPass: req.body.ShortPass,
        Freekick: req.body.Freekick,
        LongPass: req.body.LongPass,
        BallControl: req.body.BallControl,
        Intercept: req.body.Intercept,
        Positioning: req.body.Positioning,
        Marking: req.body.Marking,
        Tackle: req.body.Tackle,
        GKReflexes: req.body.GKReflexes,
        Height: req.body.Height,
        Weight: req.body.Weight,
      });
      return res.status(200).json({
        message: 'Tạo sport profile thành công',
        data: newProfile,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  getProfileById: async (req, res) => {
    try {
      const { id } = req.params;
      const profile = await Profile.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'users', // Assuming your users collection is named 'users'
            localField: 'user',
            foreignField: '_id',
            as: 'userData',
          },
        },
        {
          $unwind: '$userData',
        },
        {
          $project: {
            _id: 1,
            user: {
              _id: '$userData._id',
              firstName: '$userData.firstName',
              lastName: '$userData.lastName',
              avatar: '$userData.avatar',
            },
            position: 1,
            Crossing: 1,
            Finishing: 1,
            Heading: 1,
            ShortPass: 1,
            Freekick: 1,
            LongPass: 1,
            BallControl: 1,
            Intercept: 1,
            Positioning: 1,
            Marking: 1,
            Tackle: 1,
            GKReflexes: 1,
            Height: 1,
            Weight: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);
      if (profile.length == 0) {
        return res.status(404).json({
          message: 'Profile not found',
        });
      }
      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  updateProfileById: async (req, res) => {
    try {
      const { id } = req.params;
      let profile = await Profile.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      //   console.log(req.body);
      if (!profile) {
        return res.status(404).json({
          message: 'Profile not found',
        });
      }
      let position = '';
      let stats = Sport_Const.STAT.map((key) => Number(profile[key]));
      //   console.log(stats);
      await axios
        .post(`http://localhost/predict`, {
          stats,
        })
        .then(async (response) => {
          position = response.data.position;
        })
        .catch(function (err) {
          return res.status(500).json({
            message: 'Server error at machine learning model',
            error: err,
          });
        });
      position = Sport_Const.POSITION[position];
      //   console.log(position);
      profile.position = position;
      await profile.save();
      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },

  match: async (req, res) => {
    try {
      const { position } = req.body;
      if (!Sport_Const.POSITION.includes(position)) {
        return res.status(400).json({
          message: 'invalid position',
        });
      }
      const profile = await Profile.aggregate([
        { $match: { position: position } },
        { $limit: req.query.limit || 10 },
        { $skip: (req.query.limit || 10) * (req.query.page || 0) },
        {
          $lookup: {
            from: 'users', // Assuming your users collection is named 'users'
            localField: 'user',
            foreignField: '_id',
            as: 'userData',
          },
        },
        {
          $unwind: '$userData',
        },
        {
          $project: {
            _id: 1,
            user: {
              _id: '$userData._id',
              firstName: '$userData.firstName',
              lastName: '$userData.lastName',
              avatar: '$userData.avatar',
            },
            position: 1,
            Crossing: 1,
            Finishing: 1,
            Heading: 1,
            ShortPass: 1,
            Freekick: 1,
            LongPass: 1,
            BallControl: 1,
            Intercept: 1,
            Positioning: 1,
            Marking: 1,
            Tackle: 1,
            GKReflexes: 1,
            Height: 1,
            Weight: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);
      if (profile.length == 0) {
        return res.status(404).json({
          message: 'Profile not found',
        });
      }
      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error,
      });
    }
  },
};

module.exports = ProfileController;
