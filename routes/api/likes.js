const { Router } = require("express");

const { getLikePresetsByUserId } = require("../../services/likes");

const router = Router();

module.exports = (app) => {
  app.use("/likes", router);

  router.get("/", async (req, res) => {
    let { page, limit } = req.query;
    const userId = req.user.id;
    const start = (page - 1) * limit;
    const likes = await getLikePresetsByUserId(start, limit, userId);

    res.json(likes);
  });
};
