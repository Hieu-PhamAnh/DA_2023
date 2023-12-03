const User = require("../model/User");
const mongoose = require("mongoose");
const Token = require("../model/Token");
const {
  spawnToken,
  deleteTokenDB,
  refresh,
} = require("../service/auth.service");

const AuthController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const checkUser = await User.findOne({ username: username });
      if (!checkUser) {
        return res.status(404).json({
          message: "Người dùng không tồn tại",
        });
      }
      if (password != checkUser.password) {
        return res.status(400).json({
          message: "Wrong password",
        });
      }
      await deleteTokenDB(checkUser);
      const token = await spawnToken(checkUser);
      const newToken = await Token.create({
        userID: checkUser._id,
        token: token.refreshToken,
      });
      return res.status(200).json({
        message: "Đăng nhập thành công",
        username: checkUser.username,
        // userId: checkUser._id,
        token: token,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
        error: error,
      });
    }
  },
  logout: async (req, res) => {
    try {
      const userID = req.body.verify_id;
      console.log(userID);
      const user = await User.findById(userID);
      const check = await deleteTokenDB(user);
      if (check > 0) {
        // res.clearCookie("auth_token"); // assuming auth token was stored in a cookie
        // res.redirect("/");
        return res.status(200).json({
          message: "Đăng xuất thành công",
        });
      }
      return res.status(400).json({
        message: "Người dùng đã đăng xuất rồi",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error - loi o logout",
        error: error,
      });
    }
  },
  refreshToken: async (req, res) => {
    const auth = req.headers.authorization;
    try {
      const refreshToken = auth.split(" ")[1];
      const data = refresh(refreshToken);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({
        message: "Thiếu token",
        error: error,
      });
    }
  },
  loginGoogle: async (req, res) => {
    try {
      const { email, displayName, photoUrl } = req.body;

      let user = await User.findOne({ mail: email });

      if (!user) {
        user = await User.create({
          mail: email,
          fullname: displayName,
          ingame: displayName,
          mainAva: photoUrl,
        });
      }

      await deleteTokenDB(user);

      const token = await spawnToken(user);
      const newToken = await Token.create({
        userID: user._id,
        token: token.refreshToken,
      });

      return res.status(200).json({
        message: "Đăng nhập thành công",
        email: user.email,
        token,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
        error: error,
      });
    }
  },
};

module.exports = AuthController;
