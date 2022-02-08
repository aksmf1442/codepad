const { User, Like } = require("../models");

const getLikePresetsByUserId = async (userId) => {
  const user = await User.findOne({ shortId: userId });
  let likes = await Like.find({ user })
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

module.exports = { getLikePresetsByUserId };