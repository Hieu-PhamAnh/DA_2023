const User = require("../model/User");
const Token = require("../model/Token");
const jwt = require("jsonwebtoken");

const spawnToken = async (user) => {
  const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_KEY, {
    expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRE || 10) * 60,
  });

  const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_KEY, {
    expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRE || 10) * 60,
  });

  let token = {
    accessToken: accessToken,
    expiresAt: Date.now() + Number(process.env.ACCESS_TOKEN_EXPIRE) * 60 * 1000,
    refreshToken: refreshToken,
    expiresAt:
      Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRE) * 60 * 1000,
  };

  return token;
};

const refresh = async (refreshToken) => {
  const checkDB = await Token.findOne({ token: refreshToken });
  let returnData = {};
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_KEY);
    const user = await User.findOne({ _id: payload._id });
    const token = await spawnToken(user);
    checkDB.token = token.refreshToken;
    await checkDB.save();
    returnData = {
      data: token,
      // access_token: token.accessToken,
      // expriseAt: token.expriseAt,
    };
    return returnData;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      await checkDB.delete();
      returnData = {
        message: "Refresh token hết hạn",
        error: error,
      };
      return returnData;
    }
    return (returnData = {
      message: "Refresh Token không hợp lệ",
      error: error,
    });
  }
};

const deleteTokenDB = async (user) => {
  try {
    const token = await Token.find({ userID: user._id });
    // console.log("đã tìm thấy: " + token.length);
    if (token.length > 0) {
      // console.log(token[0].userID);
      await Token.deleteMany({ userID: token[0].userID });
    }
    return token.length;
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error,
    });
  }
};

module.exports = { spawnToken, deleteTokenDB, refresh };
