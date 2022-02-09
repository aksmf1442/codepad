const { Router } = require("express");
const router = Router();
const {
  getPresetsByTitle,
  getPresetsByTag,
  getArtistsByArtistName,
} = require("../../services/search");

module.exports = (app) => {
  app.use("/search", router);

  router.get("/", async (req, res) => {
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
  });
};
