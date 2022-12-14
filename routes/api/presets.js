const { Router } = require("express");
const { asyncHandler, getUserByEmail } = require("../../utils");
const { soundStore, imageStore, loginRequired } = require("../../middlewares");
const { page, limit } = { page: 1, limit: 10 };
const skip = (page - 1) * limit;

const {
  getPresetByUserId,
  getPresetByPresetId,
  getPresetsByPresetId,
  getMyPreset,
  getMyPresets,
  getDefaultPreset,
  getDefaultPresets,
  getTagsByPresetId,
  getCommunityCountByPresetId,
  getCommentsByPresetId,
  addComment,
  updateCommentByCommentId,
  deleteCommentByCommentId,
  getLikeClickedState,
  addInstrument,
  updateInstrument,
  addPreset,
  updatePresetByPresetId,
  addTag,
  deleteTags,
  addForkByPresetId,
  getForkCountByPresetId,
  getPresetCurrentPage,
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
      // const user = await getUserByEmail("aksmf1442@gmail.com");
      const user = req.user;
      const thumbnailURL = !req.file ? undefined : req.file.path;
      const presetType = "custom";
      const preset = await addPreset(
        title,
        user,
        isPrivate,
        thumbnailURL,
        presetType
      );

      for (let i = 0; i < tags.length; i++) {
        await addTag(preset, tags[i]);
      }

      res.json({ presetId: preset.shortId });
    })
  );

  router.put(
    "/",
    loginRequired,
    imageStore.single("img"),
    asyncHandler(async (req, res, next) => {
      const { title, isPrivate, tags, presetId } = req.body;
      const thumbnailURL = !req.file ? undefined : req.file.path;
      const preset = await updatePresetByPresetId(
        presetId,
        title,
        isPrivate,
        thumbnailURL
      );

      await deleteTags(preset);
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
      const soundSampleURL = !req.file ? undefined : req.file.path;

      await addInstrument(
        presetId,
        location,
        buttonType,
        soundType,
        soundSampleURL
      );

      res.json({ message: "?????? ??????" });
    })
  );

  router.put(
    "/soundUpload",
    loginRequired,
    soundStore.single("sound"),
    asyncHandler(async (req, res) => {
      const { presetId, location, buttonType, soundType, soundSampleURL } =
        req.body;
      const newSoundSampleURL = !req.file ? undefined : req.file.path;

      await updateInstrument(
        presetId,
        location,
        buttonType,
        soundType,
        soundSampleURL,
        newSoundSampleURL
      );

      res.json({ message: "?????? ??????" });
    })
  );

  router.get(
    "/myPreset",
    loginRequired,
    asyncHandler(async (req, res) => {
      // const user = await getUserByEmail("aksmf1442@gmail.com");
      const user = req.user;
      const preset = await getMyPreset(user);

      res.json(preset);
    })
  );

  router.get(
    "/myPresetList",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { page, limit } = req.query;
      const skip = (page - 1) * limit;
      // const user = await getUserByEmail("aksmf1442@gmail.com");
      const user = req.user;
      const presets = await getMyPresets(skip, limit, user);

      res.json(presets);
    })
  );

  router.get(
    "/:presetId/list",
    asyncHandler(async (req, res) => {
      const { page, limit } = req.query;
      const skip = (page - 1) * limit;
      const { presetId } = req.params;
      const presets = await getPresetsByPresetId(skip, limit, presetId);

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
      const { page, limit } = req.query;
      const { presetId } = req.params;
      const skip = (page - 1) * limit;
      const comments = await getCommentsByPresetId(skip, limit, presetId);

      res.json(comments);
    })
  );

  router.post(
    "/:presetId/comments",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const { text } = req.body;
      // const user = await getUserByEmail("aksmf1442@gmail.com");
      const user = req.user;
      await addComment(presetId, user, text);
      const comments = await getCommentsByPresetId(skip, limit, presetId);

      res.json(comments);
    })
  );

  router.put(
    "/:presetId/comments",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const { commentId, text } = req.body;
      // const user = await getUserByEmail("aksmf1442@gmail.com");
      const user = req.user;
      await updateCommentByCommentId(commentId, text, user);
      const comments = await getCommentsByPresetId(skip, limit, presetId);
      res.json(comments);
    })
  );

  router.delete(
    "/:presetId/comments",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const { commentId } = req.body;
      // const user = await getUserByEmail("aksmf1442@gmail.com");
      const user = req.user;
      await deleteCommentByCommentId(commentId, user);
      const comments = await getCommentsByPresetId(skip, limit, presetId);
      res.json(comments);
    })
  );

  router.get(
    "/:presetId/like",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      // const user = await getUserByEmail("aksmf1442@gmail.com");
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
      // const user = await getUserByEmail("aksmf1442@gmail.com");
      const user = req.user;
      const click = true;
      const isClicked = await getLikeClickedState(click, presetId, user);

      res.json({ isClicked });
    })
  );

  router.get(
    "/:presetId/fork",
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const forkCount = await getForkCountByPresetId(presetId);
      res.json({ forkCount });
    })
  );

  router.post(
    "/:presetId/fork",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      // const user = await getUserByEmail("aksmf1442@gmail.com");
      const user = req.user;
      await addForkByPresetId(presetId, user);
      res.json({ message: "success" });
    })
  );

  router.get(
    "/:presetId/page",
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const { limit } = req.query;
      const page = await getPresetCurrentPage(presetId, limit);
      res.json({ page });
    })
  );

  router.get(
    "/defaultPreset",
    asyncHandler(async (req, res) => {
      const preset = await getDefaultPreset();
      res.json(preset);
    })
  );

  router.post(
    "/defaultPreset",
    loginRequired,
    imageStore.single("img"),
    asyncHandler(async (req, res) => {
      const { title } = req.body;
      // const user = await getUserByEmail("aksmf1442@gmail.com");
      const user = req.user;
      const { isPrivate, presetType } = {
        isPrivate: true,
        presetType: "default",
      };

      const thumbnailURL = !req.file ? undefined : req.file.path;
      const preset = await addPreset(
        title,
        user,
        isPrivate,
        thumbnailURL,
        presetType
      );
      res.json({ presetId: preset.shortId });
    })
  );

  router.get(
    "/defaultPresetList",
    asyncHandler(async (req, res) => {
      const { page, limit } = req.query;
      const skip = (page - 1) * limit;
      const presets = await getDefaultPresets(skip, limit);
      res.json(presets);
    })
  );

  router.get(
    "/:userId",
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const preset = await getPresetByUserId(userId);
      res.json(preset);
    })
  );

  router.get(
    "/defaultPreset/:presetId",
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const preset = await getPresetByPresetId(presetId);
      res.json(preset);
    })
  );

  router.get(
    "/:userId/:presetId",
    asyncHandler(async (req, res) => {
      const { presetId } = req.params;
      const preset = await getPresetByPresetId(presetId);
      res.json(preset);
    })
  );
};
