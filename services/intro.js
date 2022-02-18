const { Preset, Like, User } = require("../models");

const sortPresetsByLikeAndVisitCount = async (presets) => {
  const comparablePresets = await Promise.all(
    presets.map(async (preset) => {
      const likeCount = await Like.countDocuments({ preset });
      return {
        presetId: preset.shortId,
        userId: preset.author.shortId,
        thumbnailURL: preset.thumbnailURL,
        title: preset.title,
        author: preset.author.name,
        likeCount,
        viewCount: preset.viewCount,
      };
    })
  );
  comparablePresets.sort((a, b) => {
    if (a.likeCount === b.likeCount) {
      return b.viewCount - a.viewCount;
    }
    return b.likeCount - a.likeCount;
  });
  return comparablePresets;
};

const skipAndLimitPresets = (presets, skip, limit) => {
  let skipAndLimitPresets = [];
  for (let i = skip; i < presets.length; i++) {
    if (skipAndLimitPresets.length === Number(limit)) {
      break;
    }
    const preset = presets[i];

    skipAndLimitPresets.push({
      presetId: preset.presetId,
      thumbnailURL: preset.thumbnailURL,
      title: preset.title,
      author: preset.author,
      userId: preset.userId,
    });
  }

  return skipAndLimitPresets;
};

const getPopularPresets = async (skip, limit) => {
  let presets = await Preset.find()
    .where("isPrivate")
    .equals(false)
    .populate("author");

  const comparablePresets = await sortPresetsByLikeAndVisitCount(presets);
  presets = skipAndLimitPresets(comparablePresets, skip, limit);

  return presets;
};

const sortRecentlyUsedPresets = async (presets) => {
  const recentlyUsedPresets = await Promise.all(
    presets.map(async (presetId) => {
      const preset = await Preset.findOne({ shortId: presetId });
      if (!preset) {
        throw new Error("프리셋 정보가 없습니다.");
      }
      return preset;
    })
  );

  recentlyUsedPresets.sort((a, b) => {
    return b.updatedAt - a.updatedAt;
  });
  return recentlyUsedPresets;
};

const getRecentlyUsedPresets = async (presets, skip, limit) => {
  const recentlyUsedPresets = await sortRecentlyUsedPresets(presets);

  presets = skipAndLimitPresets(recentlyUsedPresets, skip, limit);
  return presets;
};

const sortArtistsByLikeCount = async (users) => {
  const artists = await Promise.all(
    users.map(async (user) => {
      const presets = await Preset.find({ author: user });
      let likeCount = 0;
      for (let i = 0; i < presets.length; i++) {
        likeCount += await Like.countDocuments({ preset: presets[i] });
      }
      return {
        userId: user.shortId,
        thumbnailURL: user.thumbnailURL,
        name: user.name,
        likeCount,
      };
    })
  );

  artists.sort((a, b) => {
    return b.likeCount - a.likeCount;
  });
  return artists;
};

const skipAndLimitArtists = (artists, skip, limit) => {
  const popularArtists = [];
  for (let i = skip; i < artists.length; i++) {
    if (popularArtists.length === Number(limit)) {
      break;
    }
    const user = artists[i];
    popularArtists.push({
      userId: user.userId,
      author: user.name,
      thumbnailURL: user.thumbnailURL,
    });
  }
  return popularArtists;
};

const getPopularArtists = async (skip, limit) => {
  let users = await User.find();
  const artists = await sortArtistsByLikeCount(users);
  const popularArtists = skipAndLimitArtists(artists, skip, limit);
  return popularArtists;
};

module.exports = {
  getPopularPresets,
  getRecentlyUsedPresets,
  getPopularArtists,
};
