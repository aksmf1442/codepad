const { Router } = require("express");
const { asyncHandler } = require("../../utils");
const { getLikePresetsByUserId } = require("../../services/likes");

const router = Router();

module.exports = (app) => {
  app.use("/likes", router);

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const { page, limit } = req.query;
      const userId = req.user.id;
      const skip = (page - 1) * limit;
      const likes = await getLikePresetsByUserId(skip, limit, userId);

      res.json(likes);
    })
  );
};
