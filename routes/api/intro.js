const { Router } = require("express");
const { getPresetsByPresetId } = require("../../services/intro");
const router = Router();

module.exports = (app) => {
  app.use("/intro", router);

  router.get("/top50List", async (req, res) => {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const presets = await getPresetsByPresetId(skip, limit);
    res.json(presets);
  });
};
