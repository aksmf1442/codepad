const { Router } = require("express");

const { getLikePresetsByUserId } = require("../../services/likes");

const router = Router();

module.exports = (app) => {
  app.use("/likes", router);

  router.get("/", async (req, res) => {
    const userId = req.user.id;
    const likes = await getLikePresetsByUserId(userId);

    res.json(likes);
  });
};
