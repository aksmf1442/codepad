const { Like } = require("../models");

const getLikePresetsByUser = async (skip, limit, user) => {
  let likes = await Like.find({ user })
    .skip(skip)
    .limit(limit)
    .sort({ updatedAt: "desc" })
    .populate("preset");

  likes = likes.map((like) => {
    return {
      presetId: like.preset.shortId,
      thumbnailURL: like.preset.thumbnailURL,
      title: like.preset.title,
    };
  });
  return likes;
};

module.exports = { getLikePresetsByUser };
