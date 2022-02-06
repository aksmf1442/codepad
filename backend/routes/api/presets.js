const { Router } = require("express");
const upload = require("../../middlewares/multer");

const {
  getPresetByUserId,
  getPresetByPresetId,
  getPresetsByPresetId,
  getTagsByPresetId,
  getCommunityCountByPresetId,
  getCommentsByPresetId,
  createComment,
  updateCommentByCommentId,
  deleteCommentByCommentId,
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

  router.get("/:presetId/comments", async (req, res) => {
    const { presetId } = req.params;
    const comments = await getCommentsByPresetId(presetId);

    res.json(comments);
  });

  router.post("/:presetId/comments", async (req, res) => {
    const { presetId } = req.params;
    const { text } = req.query;
    const userId = req.user.id;
    const comment = await createComment(prsetId, userId, text);
    const comments = await getCommentsByPresetId(presetId);

    // 바로 댓글 리스트 보내줄 지 의논 후 결정(이 후 수정)
    res.json(comments);
  });

  router.put("/:presetId/comments", async (req, res) => {
    const { presetId } = req.params;
    const { commentId } = req.query;
    const comment = await updateCommentByCommentId(commentId, text);
    const comments = await getCommentsByPresetId(presetId);

    // 바로 댓글 리스트 보내줄 지 의논 후 결정(이 후 수정)
    res.json(comments);
  });

  router.delete("/:presetId/comments", async (req, res) => {
    const { presetId } = req.params;
    const { commentId } = req.query;
    const comment = await deleteCommentByCommentId(commentId);
    const comments = await getCommentsByPresetId(presetId);

    // 바로 댓글 리스트 보내줄 지 의논 후 결정(이 후 수정)
    res.json(comments);
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
