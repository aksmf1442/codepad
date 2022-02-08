const { Preset, Tag, User } = require("../models");

const getPresetsByTitle = async (start, limit, title) => {
  let presets = await Preset.find({ title: { $regex: title, $options: "gi" } })
    .skip(start)
    .limit(limit)
    .populate("author");

  presets.sort((a, b) => {
    if (a.title.length === b.title.length) {
      return a.updatedAt - b.updatedAt;
    }
    return a.title.length - b.title.length;
  });

  presets = presets.map(({ shortId, thumbnailURL, title, author }) => {
    return {
      presetId: shortId,
      thumbnailURL,
      title,
      author: author.name,
    };
  });

  return presets;
};

const getPresetsByTag = async (start, limit, tag) => {
  let tags = await Tag.find({ text: { $regex: tag, $options: "gi" } })
    .skip(start)
    .limit(limit)
    .populate({ path: "preset", populate: "author" });

  tags.sort((a, b) => {
    if (a.text.length === b.text.length) {
      return a.updatedAt - b.updatedAt;
    }
    return a.text.length - b.text.length;
  });

  tags = tags.map(({ preset }) => {
    return {
      presetId: preset.shortId,
      thumbnailURL: preset.thumbnailURL,
      title: preset.title,
      author: preset.author.name,
    };
  });

  return tags;
};

const getArtistsByArtistName = async (start, limit, artist) => {
  let users = await User.find({ name: { $regex: artist, $options: "gi" } })
    .skip(start)
    .limit(limit);

  users.sort((a, b) => {
    if (a.name.length === b.name.length) {
      return a.updatedAt - b.updatedAt;
    }
    return a.name.length - b.name.length;
  });

  users = users.map((user) => {
    return {
      userId: user.shortId,
      thumbnailURL: user.thumbnailURL,
      name: user.name,
    };
  });

  return users;
};

module.exports = { getPresetsByTitle, getPresetsByTag, getArtistsByArtistName };
