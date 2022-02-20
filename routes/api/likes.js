const { Router } = require("express");
const { asyncHandler, getUserByEmail } = require("../../utils");
const { getLikePresetsByUser } = require("../../services/likes");
const { loginRequired } = require("../../middlewares");

const router = Router();

module.exports = (app) => {
  app.use("/likes", router);

  router.get(
    "/",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { page, limit } = req.query;
      // const user = await getUserByEmail("aksmf1442@gmail.com");
      const user = req.user;
      const skip = (page - 1) * limit;
      const likes = await getLikePresetsByUser(skip, limit, user);

      res.json(likes);
    })
  );
};
