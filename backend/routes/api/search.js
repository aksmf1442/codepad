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
    const start = (Number(page) - 1) * limit;
    let searchData;

    if (title !== "undefined") {
      searchData = await getPresetsByTitle(start, limit, title);
    }

    if (tag !== "undefined") {
      searchData = await getPresetsByTag(start, limit, tag);
    }

    if (artist !== "undefined") {
      searchData = await getArtistsByArtistName(start, limit, artist);
    }

    res.json(searchData);
  });
};
