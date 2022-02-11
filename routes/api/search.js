const { Router } = require("express");
const { asyncHandler } = require("../../utils");
const {
  getPresetsByTitle,
  getPresetsByTag,
  getArtistsByArtistName,
} = require("../../services/search");
const router = Router();

module.exports = (app) => {
  app.use("/search", router);

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const { title, tag, artist, page, limit } = req.query;
      const skip = (page - 1) * limit;
      let searchData;

      if (title !== undefined) {
        searchData = await getPresetsByTitle(skip, limit, title.trim());
      }

      if (tag !== undefined) {
        searchData = await getPresetsByTag(skip, limit, tag.trim());
      }

      if (artist !== undefined) {
        searchData = await getArtistsByArtistName(skip, limit, artist.trim());
      }

      res.json(searchData);
    })
  );
};
