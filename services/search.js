const { Preset, Tag, User } = require("../models");

const sortData = (data, category) => {
  data.sort((a, b) => {
    if (category === "preset") {
      if (a.title.length === b.title.length) {
        return a.updatedAt - b.updatedAt;
      }
      return a.title.length - b.title.length;
    }
    if (category === "tag") {
      if (a.text.length === b.text.length) {
        return a.updatedAt - b.updatedAt;
      }
      return a.text.length - b.text.length;
    }
    if (category === "artist") {
      if (a.name.length === b.name.length) {
        return a.updatedAt - b.updatedAt;
      }
      return a.name.length - b.name.length;
    }
  });
  return data;
};

const skipAndLimitData = (data, skip, limit) => {
  let skipAndLimitData = [];
  for (let i = skip; i < data.length; i++) {
    if (skipAndLimitData.length === Number(limit)) {
      break;
    }
    skipAndLimitData.push(data[i]);
  }
  return skipAndLimitData;
};

const parseData = (data, skip, limit, category) => {
  data = sortData(data, category);
  data = skipAndLimitData(data, skip, limit);

  return data;
};

const getPresetsByTitle = async (skip, limit, title) => {
  let presets = await Preset.find({
    title: { $regex: title, $options: "gi" },
  })
    .where("isPrivate")
    .equals(false)
    .populate("author");

  presets = parseData(presets, skip, limit, "preset");
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

const getPresetsByTag = async (skip, limit, tag) => {
  let tags = await Tag.find({ text: { $regex: tag, $options: "gi" } }).populate(
    { path: "preset", match: { isPrivate: false }, populate: "author" }
  );

  tags = parseData(tags, skip, limit, "tag");
  const presets = tags.map(({ preset }) => {
    return {
      presetId: preset.shortId,
      thumbnailURL: preset.thumbnailURL,
      title: preset.title,
      author: preset.author.name,
    };
  });

  return presets;
};

const getArtistsByArtistName = async (skip, limit, artist) => {
  let users = await User.find({ name: { $regex: artist, $options: "gi" } });

  users.sort((a, b) => {
    if (a.name.length === b.name.length) {
      return a.updatedAt - b.updatedAt;
    }
    return a.name.length - b.name.length;
  });

  users = parseData(users, skip, limit, "artist");
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
