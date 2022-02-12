module.exports = (app) => {
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message || "서버 에러" });
  });
};
