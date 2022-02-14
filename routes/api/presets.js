const { Router } = require("express");
const { asyncHandler } = require("../../utils");
const { soundStore, imageStore, loginRequired } = require("../../middlewares");

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
  visitPreset,
} = require("../../services/presets");

const router = Router();

module.exports = (app) => {
  app.use("/presets", router);

  router.post(
    "/",
    loginRequired,
    imageStore.single("img"),
    asyncHandler(async (req, res, next) => {
      const { title, isPrivate, tags } = req.body;
      const user = req.user;
      const thumbnailURL = req.file === undefined ? null : req.file.path;
      const preset = await addPreset(title, user, isPrivate, thumbnailURL);

      for (let i = 0; i < tags.length; i++) {
        await addTag(preset, tags[i]);
      }

      res.json({ presetId: preset.shortId });
    })
  );

  router.post(
    "/soundUpload",
    loginRequired,
    soundStore.single("sound"),
    asyncHandler(async (req, res) => {
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
    })
  );

  // 아티스트를 눌렀을 떄 (프리셋 첫 진입)
  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const { userId } = req.body;
      const preset = await getPresetByUserId(userId);

      res.json(preset);
    })
  );

  // 프리셋 누름(첫 진입 x)
  router.get(
    "/:presetId",
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const preset = await getPresetByPresetId(presetId);

      res.json(preset);
    })
  );

  router.get(
    "/:presetId/list",
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const presets = await getPresetsByPresetId(presetId);

      res.json(presets);
    })
  );

  router.get(
    "/:presetId/tags",
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const tags = await getTagsByPresetId(presetId);

      res.json(tags);
    })
  );

  router.get(
    "/:presetId/reactions",
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const { viewCount, likeCount, commentCount } =
        await getCommunityCountByPresetId(presetId);

      res.json({ viewCount, likeCount, commentCount });
    })
  );

  router.get(
    "/:presetId/comments",
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const comments = await getCommentsByPresetId(presetId);

      res.json(comments);
    })
  );

  router.post(
    "/:presetId/comments",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const { text } = req.body;
      const user = req.user;
      await addComment(presetId, user, text);
      const comments = await getCommentsByPresetId(presetId);

      res.json(comments);
    })
  );

  router.put(
    "/:presetId/comments",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const { commentId, text } = req.body;
      const user = req.user;
      await updateCommentByCommentId(commentId, text, user);
      const comments = await getCommentsByPresetId(presetId);
      res.json(comments);
    })
  );

  router.delete(
    "/:presetId/comments",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const { commentId } = req.body;
      const user = req.user;
      await deleteCommentByCommentId(commentId, user);
      const comments = await getCommentsByPresetId(presetId);
      res.json(comments);
    })
  );

  router.get(
    "/:presetId/like",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const user = req.user;
      const click = false;
      const isClicked = await getLikeClickedState(click, presetId, user);
      res.json({ isClicked });
    })
  );

  router.post(
    "/:presetId/like",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const user = req.user;
      const click = true;
      const isClicked = await getLikeClickedState(click, presetId, user);

      res.json({ isClicked });
    })
  );

  router.post(
    "/:presetId/visit",
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      let preset = visitPreset(presetId);
      res.json(preset);
    })
  );

  router.post(
    "/:presetId/fork",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const user = req.user;
      const fork = await addForkByPresetId(presetId, user);
      res.json(fork);
    })
  );
};
