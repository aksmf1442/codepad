const createError = require("http-errors");

module.exports = (requestHandler) => async (req, res, next) => {
  try {
    await requestHandler(req, res);
  } catch (err) {
    next(createError(400, err.message));
  }
};
