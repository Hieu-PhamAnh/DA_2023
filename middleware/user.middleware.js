const User = require("../model/User");

const userMiddleware = {
    checkRequire: async (req, res, next) => {
        const { fullname, username, password } = req.body;
        if (!fullname || !username || !password) {
            return res.status(400).json({
                message: "Điền thiếu thông tin, vui lòng nhập đầy đủ thông tin",
            });
        }
        next();
    },
    checkRequiredLogin: async (req, res, next) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: "Điền thiếu thông tin, vui lòng nhập đầy đủ thông tin",
            });
        }
        next();
    },
    checkExist: async (req, res, next) => {
        const { username } = req.body;
        const user = await User.findOne({ username: username });
        // console.log(user);
        if (user) {
            return res.status(400).json({
                message: "Username đã được sử dụng",
            });
        }
        next();
    },
    checkUpdate: async (req, res, next) => {
        const list = Object.keys(req.body);
        // console.log(list);
        if (list.includes("username") || list.includes("_id")) {
            return res.status(400).json({
                message: "Không được phép sửa username, user_id",
            });
        }
        if (list.includes("password")) {
            if (!validate.isValidPassword(req.body.password)) {
                return res.status(400).json({
                    message:
                        "Password không hợp lệ, cần tối thiểu 8 kí tự và phải có chữ cái và số",
                });
            }
        }
        next();
    },
};

module.exports = userMiddleware;
