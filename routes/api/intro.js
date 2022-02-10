const { Router } = require("express");
const {
  getPopularPresets,
  getRecentlyUsedPresets,
  getPopularArtists,
} = require("../../services/intro");
const router = Router();

module.exports = (app) => {
  app.use("/intro", router);

  router.get("/top50List", async (req, res) => {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const presets = await getPopularPresets(skip, limit);
    res.json(presets);
  });

  router.get("/recentlyUsed", async (req, res) => {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const presetIdArray = req.body.presetId;
    const presets = await getRecentlyUsedPresets(presetIdArray, skip, limit);
    res.json(presets);
  });

  router.get("/artists", async (req, res) => {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const artists = await getPopularArtists(skip, limit);
    res.json(artists);
  });
};
