const createError = require("http-errors");

module.exports = (app) => {
  app.use((req, res, next) => {
    next(createError(400));
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message || "서버에러" });
  });
};
