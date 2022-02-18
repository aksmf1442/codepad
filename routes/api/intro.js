const { Router } = require("express");
const { asyncHandler } = require("../../utils");
const {
  getPopularPresets,
  getRecentlyUsedPresets,
  getPopularArtists,
} = require("../../services/intro");
const router = Router();

module.exports = (app) => {
  app.use("/intro", router);

  router.get(
    "/top50List",
    asyncHandler(async (req, res) => {
      const { page, limit } = req.query;
      const skip = (page - 1) * limit;
      const presets = await getPopularPresets(skip, limit);
      res.json(presets);
    })
  );

  router.get(
    "/recentlyUsed",
    asyncHandler(async (req, res) => {
      const { page, limit, presetIds } = req.query;
      const skip = (page - 1) * limit;
      const presets = await getRecentlyUsedPresets(presetIds, skip, limit);
      res.json(presets);
    })
  );

  router.get(
    "/artists",
    asyncHandler(async (req, res) => {
      const { page, limit } = req.query;
      const skip = (page - 1) * limit;
      const artists = await getPopularArtists(skip, limit);
      res.json(artists);
    })
  );
};
