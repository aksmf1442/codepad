const { Router } = require("express");

const { soundStore, imageStore } = require("../../middlewares/multer");

const {
  getPresetByUserId,
  getPresetByPresetId,
  getPresetsByPresetId,
  getTagsByPresetId,
  getCommunityCountByPresetId,
  getCommentsByPresetId,
  addComment,
  updateCommentByCommentId,
  deleteCommentByCommentId,
  getLikeClickedState,
  addInstrument,
  addPreset,
  addTag,
} = require("../../services/presets");

const router = Router();

module.exports = (app) => {
  app.use("/presets", router);

  // 아티스트를 눌렀을 떄 (프리셋 첫 진입)
  router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    const preset = await getPresetByUserId(userId);

    res.json(preset);
  });

  // 프리셋 누름(첫 진입 x)
  router.get("/:presetId", async (req, res) => {
    const { presetId } = req.params;
    const preset = await getPresetByPresetId(presetId);

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

  router.get("/:presetId/comments", async (req, res) => {
    const { presetId } = req.params;
    const comments = await getCommentsByPresetId(presetId);

    res.json(comments);
  });

  router.post("/:presetId/comments", async (req, res) => {
    const { presetId } = req.params;
    const { text } = req.query;
    const userId = req.user.id;
    const comment = await addComment(prsetId, userId, text);
    const comments = await getCommentsByPresetId(presetId);

    res.json(comments);
  });

  router.put("/:presetId/comments", async (req, res) => {
    const { presetId } = req.params;
    const { commentId } = req.query;
    const comment = await updateCommentByCommentId(commentId, text);
    const comments = await getCommentsByPresetId(presetId);

    res.json(comments);
  });

  router.delete("/:presetId/comments", async (req, res) => {
    const { presetId } = req.params;
    const { commentId } = req.query;
    const comment = await deleteCommentByCommentId(commentId);
    const comments = await getCommentsByPresetId(presetId);

    res.json(comments);
  });

  router.get("/presets/:prestId/like", async (req, res) => {
    const { presetId } = req.params;
    const userId = req.user.id;
    const click = false;
    const isClicked = await getLikeClickedState(click, presetId, userId);
    res.json({ isClicked });
  });

  router.post("/presets/:presetId/like", async (req, res) => {
    const { presetId } = req.params;
    const userId = req.user.id;
    const click = true;
    const isClicked = await getLikeClickedState(click, presetId, userId);

    res.json({ isClicked });
  });

  router.post("/", imageStore.single("img"), async (req, res) => {
    const { title, isPrivate, tags } = req.body;
    const userId = "K5NF2d767Am_tD5FDJS3Q";
    const thumbnailURL = req.file.path;
    console.log(thumbnailURL, title, isPrivate, userId);
    const preset = await addPreset(title, userId, isPrivate, thumbnailURL);

    for (let i = 0; i < tags.length; i++) {
      const tag = await addTag(preset, tags[i]);
    }

    res.json({ presetId: preset.shortId });
  });

  router.post("/soundUpload", soundStore.single("sound"), async (req, res) => {
    const { presetId, location, buttonType, soundType } = req.body;
    const soundSampleURL = req.file.path;
    const instrument = await addInstrument(
      presetId,
      location,
      buttonType,
      soundType,
      soundSampleURL
    );

    res.json(instrument);
  });
};