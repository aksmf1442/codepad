const { Preset, Tag, User } = require("../models");

const getPresetsByTitle = async (start, limit, title) => {
  let presets = await Preset.find({ title })
    .sort({ updatedAt: "desc" })
    .skip(start)
    .limit(Number(limit))
    .populate("author");

  presets = presets.map(({ shortId, thumbnailURL, title, author }) => {
    return {
      shortId,
      thumbnailURL,
      title,
      author: author.name,
    };
  });

  return presets;
};

const getPresetsByTag = async (start, limit, tag) => {
  let tags = await Tag.find({ text: tag })
    .sort({ updatedAt: "desc" })
    .skip(start)
    .limit(Number(limit))
    .populate({ path: "preset", populate: "author" });

  tags = tags.map(({ preset }) => {
    return {
      shortId: preset.shortId,
      thumbnailURL: preset.thumbnailURL,
      title: preset.title,
      author: preset.author.name,
    };
  });

  return tags;
};

const getArtistsByArtistName = async (start, limit, artist) => {
  let users = await User.find({ name: artist })
    .skip(start)
    .limit(Number(limit));

  users = users.map((user) => {
    return {
      shortId: user.shortId,
      thumbnailURL: user.thumbnailURL,
      name: user.name,
    };
  });

  return users;
};

module.exports = { getPresetsByTitle, getPresetsByTag, getArtistsByArtistName };
