const { Router } = require("express");
const res = require("express/lib/response");

const { soundStore, imageStore } = require("../../middlewares/multer");
const { Preset, User, Fork } = require("../../models");

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
  addForkByPresetId,
} = require("../../services/presets");

const router = Router();

module.exports = (app) => {
  app.use("/presets", router);

  router.post("/", imageStore.single("img"), async (req, res) => {
    const { title, isPrivate, tags } = req.body;
    const userId = "K5NF2d767Am_tD5FDJS3Q";
    const thumbnailURL = req.file.path;

    const preset = await addPreset(title, userId, isPrivate, thumbnailURL);

    for (let i = 0; i < tags.length; i++) {
      const tag = await addTag(preset, tags[i]);
    }

    res.json({ presetId: preset.shortId });
  });

  router.post("/soundUpload", soundStore.single("sound"), async (req, res) => {
    const { presetId, location, buttonType, soundType } = req.body;
    console.log(req.file);
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

  // 아티스트를 눌렀을 떄 (프리셋 첫 진입)
  router.get("/", async (req, res) => {
    const { userId } = req.body;
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
    const { text } = req.body;
    const userId = req.user.id;
    const comment = await addComment(presetId, userId, text);
    const comments = await getCommentsByPresetId(presetId);

    res.json(comments);
  });

  router.put("/:presetId/comments", async (req, res) => {
    const { presetId } = req.params;
    const { commentId, text } = req.body;
    const comment = await updateCommentByCommentId(commentId, text);
    const comments = await getCommentsByPresetId(presetId);
    res.json(comments);
  });

  router.delete("/:presetId/comments", async (req, res) => {
    const { presetId } = req.params;
    const { commentId } = req.body;
    const comment = await deleteCommentByCommentId(commentId);
    const comments = await getCommentsByPresetId(presetId);
    console.log(comment);
    res.json(comments);
  });

  router.get("/:presetId/like", async (req, res) => {
    const { presetId } = req.params;
    const userId = req.user.id;
    const click = false;
    const isClicked = await getLikeClickedState(click, presetId, userId);
    res.json({ isClicked });
  });

  router.post("/:presetId/like", async (req, res) => {
    const { presetId } = req.params;
    const userId = req.user.id;
    const click = true;
    const isClicked = await getLikeClickedState(click, presetId, userId);

    res.json({ isClicked });
  });

  router.post("/:presetId/visit", async (req, res) => {
    const { presetId } = req.params;
    let preset = await Preset.findOne({ shortId: presetId });
    await Preset.updateOne(
      { shortId: presetId },
      {
        viewCount: preset.viewCount + 1,
      }
    );
    res.json(preset);
  });

  // 자기 자신의 프리셋은 포크 못하게 하기
  router.post("/:presetId/fork", async (req, res) => {
    const { presetId } = req.params;
    const userId = req.user.id;
    const fork = await addForkByPresetId(presetId, userId);
    res.json(fork);
  });
};
