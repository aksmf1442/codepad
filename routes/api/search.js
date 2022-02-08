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
    let { title, tag, artist, page, limit } = req.query;
    page = Number(page);
    limit = Number(limit);
    const start = (page - 1) * limit;
    let searchData;

    if (title !== undefined) {
      searchData = await getPresetsByTitle(start, limit, title.trim());
    }

    if (tag !== undefined) {
      searchData = await getPresetsByTag(start, limit, tag.trim());
    }

    if (artist !== undefined) {
      searchData = await getArtistsByArtistName(start, limit, artist.trim());
    }

    res.json(searchData);
  });
};
