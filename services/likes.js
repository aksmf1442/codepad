const { Like } = require("../models");

const getLikePresetsByUser = async (skip, limit, user) => {
  let likes = await Like.find({ user })
    .skip(skip)
    .limit(limit)
    .sort({ updatedAt: "desc" })
    .populate({
      path: "preset",
      match: { isPrivate: false },
      populate: "author",
    });

  likes = likes.map((like) => {
    return {
      presetId: like.preset.shortId,
      thumbnailURL: like.preset.thumbnailURL,
      title: like.preset.title,
      userId: like.preset.author.shortId,
    };
  });
  return likes;
};

module.exports = { getLikePresetsByUser };
