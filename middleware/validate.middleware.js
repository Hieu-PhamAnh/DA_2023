const { default: mongoose } = require("mongoose");

const validateMiddleware = {
    checkEmpty: (req, res, next) => {
        if (!Object.keys(req.body).length) {
            return res.status(400).json({
                message: "Request không chứa thông tin",
            });
        }
        next();
    },
    checkValidId: async (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "id truyền trong params không hợp lệ",
            });
        }
        next();
    },
    checkQuerry: async (req, res, next) => {
        if (!("page" in req.query && "limit" in req.query)) {
            return res.status(400).json({
                message: "Query không có page hoặc limit",
            });
        }
        const [page, limit] = [Number(req.query.page), Number(req.query.limit)];
        // console.log(page, " ", limit);
        if (isNaN(page) || isNaN(limit)) {
            return res.status(400).json({
                message: "Query không đúng định dạng: page và limit là số",
            });
        }
        if (
            page <= 0 ||
            limit <= 0 ||
            !Number.isInteger(page) ||
            !Number.isInteger(limit)
        ) {
            //   console.log(Number.isInteger(page), " ", Number.isInteger(limit));
            return res.status(400).json({
                message:
                    "page phải là số nguyên không âm, limit phải là số nguyên dương",
            });
        }
        next();
    },
};

module.exports = validateMiddleware;
