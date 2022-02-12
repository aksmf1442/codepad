const createError = require("http-errors");
const { validateToken } = require("../utils");
const { User } = require("../models");

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!req.cookies.token) {
    next(createError(400, "로그인이 필요합니다."));
    return;
  }

  validateToken(token, async (error, decoded) => {
    if (error) {
      next(createError(400, "토큰 정보가 잘못되었습니다."));
      return;
    }

    const user = await User.findOne({ shortId: decoded.id });

    if (!user) {
      next(createError(400, "회원 정보가 없습니다."));
    }

    req.user = user;
    next();
  });
};
