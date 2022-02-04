const { Router } = require("express");
const upload = require("../../middlewares/multer");

const {
  getPresetByUserId,
  getPresetByPresetId,
  getPresetsByPresetId,
  getTagsByPresetId,
  getCommunityCountByPresetId,
} = require("../../services/presets");

const router = Router();

module.exports = (app) => {
  app.use("/presets", router);

  // 아티스트를 눌렀을 떄 (프리셋 첫 진입)
  router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    const preset = getPresetByUserId(userId);

    res.json(preset);
  });

  // 프리셋 누름(첫 진입 x)
  router.get("/:presetId", async (req, res) => {
    const { presetId } = req.params;
    const preset = getPresetByPresetId(presetId);

    res.json(preset);
  });

  router.get("/:presetId/list", async (req, res) => {
    const { presetId } = req.params;
    const presets = await getPresetsByPresetId(presetId);

    res.json(presets);
  });

  router.get("/:presetId/tags", async (req, res) => {
    const { presetId } = req.params;
    const tags = await getTagsByPresetId(presetId);

    res.json(tags);
  });

  router.get("/:presetId/reactions", async (req, res) => {
    const { presetId } = req.params;
    const { viewCount, likeCount, commentCount } =
      await getCommunityCountByPresetId(presetId);

    res.json({ viewCount, likeCount, commentCount });
  });

  // 프리셋 컴포넌트(의논해봐야함)
  router.post(
    "/",
    upload.fields([{ name: "img" }, { name: "sounds" }]),
    (req, res) => {
      const { title, isPrivate, tags, sounds } = req.body;
      console.log(req.file);
      console.log("-----");
      console.log(req.files);
      res.send("success");
    }
  );
};
