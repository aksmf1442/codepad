const { nanoid } = require("nanoid");
const {
  Preset,
  User,
  Instrument,
  Like,
  Comment,
  Tag,
  SoundSample,
  Location,
  Fork,
} = require("../models");

const getSoundSamplesByPreset = async (preset) => {
  let soundSamples = await Instrument.find({ preset })
    .populate("soundSample")
    .populate("location");

  soundSamples = soundSamples.map((ins) => {
    return {
      location: {
        x: ins.location.x,
        y: ins.location.y,
      },
      soundSampleId: ins.soundSample.shortId,
      soundSampleURL: ins.soundSample.URL,
      buttonType: ins.buttonType,
      soundType: ins.soundType,
    };
  });

  return soundSamples;
};

const parsePresetData = (preset, soundSamples) => {
  return {
    presetTitle: preset.title,
    presetId: preset.shortId,
    areaSize: preset.size,
    thumbnailURL: preset.thumbnailURL,
    soundSamples,
  };
};

const getPresetByUserId = async (userId) => {
  const user = await User.findOne({ shortId: userId });
  const preset = await Preset.find({ author: user })
    .where("isPrivate")
    .equals(false)
    .sort({
      updatedAt: "desc",
    })
    .limit(1);

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  const soundSamples = await getSoundSamplesByPreset(preset);

  return parsePresetData(preset[0], soundSamples);
};

const getPresetByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId });

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  const soundSamples = await getSoundSamplesByPreset(preset);

  return parsePresetData(preset, soundSamples);
};

const getDefaultPreset = async () => {
  const presetType = "default";
  const presets = await Preset.find({ presetType })
    .sort({
      updatedAt: "asc",
    })
    .limit(1);

  const preset = presets[0];

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  const soundSamples = await getSoundSamplesByPreset(preset);

  return parsePresetData(preset, soundSamples);
};

const getDefaultPresets = async () => {
  const presetType = "default";
  let presets = await Preset.find({ presetType }).sort({
    updatedAt: "desc",
  });

  presets = presets.map((preset) => {
    return {
      presetId: preset.shortId,
      title: preset.title,
    };
  });

  return presets;
};

const getCommunityCount = async (preset) => {
  const viewCount = preset.viewCount;
  const likeCount = await Like.countDocuments({ preset });
  const commentCount = await Comment.countDocuments({ preset });
  return { viewCount, likeCount, commentCount };
};

const parsePresetsData = async (presets) => {
  return await Promise.all(
    presets.map(async (preset) => {
      const { viewCount, likeCount, commentCount } = await getCommunityCount(
        preset
      );

      return {
        presetId: preset.shortId,
        title: preset.title,
        reactions: {
          viewCount,
          likeCount,
          commentCount,
        },
      };
    })
  );
};

const getMyPresets = async (user) => {
  let presets = await Preset.find({ author: user }).sort({
    updatedAt: "desc",
  });

  presets = await parsePresetsData(presets);

  return presets;
};

const getPresetsByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId }).populate("author");

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  let presets = await Preset.find({ author: preset.author })
    .where("isPrivate")
    .equals(false);

  presets = await parsePresetsData(presets);

  return presets;
};

const getTagsByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId });

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  let tags = await Tag.find({ preset });
  tags = tags.map((tag) => tag.text);

  return tags;
};

const getCommunityCountByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId });

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  const { viewCount, likeCount, commentCount } = await getCommunityCount(
    preset
  );

  return { viewCount, likeCount, commentCount };
};

const parseComments = (comments) => {
  comments = comments.map((comment) => {
    return {
      userName: comment.author.name,
      userId: comment.author.shortId,
      userImageURL: comment.author.thumbnailURL,
      commentId: comment.shortId,
      comment: comment.text,
    };
  });
  return comments;
};

const getCommentsByPresetId = async (skip, limit, presetId) => {
  const preset = await Preset.findOne({ shortId: presetId });

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  let comments = await Comment.find({ preset })
    .sort({
      updatedAt: "desc",
    })
    .skip(skip)
    .limit(limit)
    .populate("author");

  comments = parseComments(comments);
  return comments;
};

const addComment = async (presetId, user, text) => {
  const preset = await Preset.findOne({ shortId: presetId });

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  const comment = await Comment.create({
    shortId: nanoid(),
    author: user,
    preset: preset,
    text,
  });
  return comment;
};

const validateCommentUser = async (user, commentId) => {
  const comment = await Comment.findOne({ shortId: commentId }).populate(
    "author"
  );

  if (!comment) {
    throw new Error("댓글 정보가 없습니다.");
  }

  if (user.shortId !== comment.author.shortId) {
    throw new Error("잘못된 접근입니다.");
  }
};

const updateCommentByCommentId = async (commentId, text, user) => {
  validateCommentUser(user, commentId);
  const comment = await Comment.findOneAndUpdate(
    { shortId: commentId },
    { text }
  );

  return comment;
};

const deleteCommentByCommentId = async (commentId, user) => {
  validateCommentUser(user, commentId);
  const comment = await Comment.findOneAndDelete({ shortId: commentId });

  return comment;
};

const validateClickAndGetLike = async (click, user, preset) => {
  let like = await Like.findOne({ user, preset });

  if (click && like === null) {
    await Like.create({ user, preset });
  } else if (click && like !== null) {
    await Like.findOneAndDelete({ user, preset });
  }
  like = await Like.findOne({ user, preset });
  return like;
};

const getLikeClickedState = async (click, presetId, user) => {
  const preset = await Preset.findOne({ shortId: presetId });

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  const like = await validateClickAndGetLike(click, user, preset);
  let isCliked = true;
  if (like === null) {
    isCliked = false;
  }
  return isCliked;
};

const addPreset = async (title, user, isPrivate, thumbnailURL, presetType) => {
  if (!title || !isPrivate) {
    throw new Error("필수 정보 입력이 필요합니다.");
  }
  const size = 8;
  const preset = await Preset.create({
    shortId: nanoid(),
    presetType,
    author: user,
    title,
    isPrivate,
    size,
    thumbnailURL,
  });

  return preset;
};

const addInstrument = async (
  presetId,
  location,
  buttonType,
  soundType,
  soundSampleURL
) => {
  if (!presetId || !location || !buttonType || !soundType || !soundSampleURL) {
    throw new Error("필수 정보 입력이 필요합니다.");
  }
  const soundSample = await SoundSample.create({
    shortId: nanoid(),
    URL: soundSampleURL,
  });
  let parseLocation = location.split("X");
  parseLocation = await Location.create({
    x: parseLocation[0],
    y: parseLocation[1],
  });
  const preset = await Preset.findOne({ shortId: presetId });

  const instrument = await Instrument.create({
    preset,
    soundSample,
    location: parseLocation,
    buttonType,
    soundType,
  });

  return instrument;
};

const addTag = async (preset, text) => {
  const tag = await Tag.create({ preset, text });
  return tag;
};

const validateFirstFork = async (fork, preset) => {
  if (fork) {
    await Fork.findOneAndUpdate(
      { preset },
      {
        count: fork.count + 1,
      }
    );
  } else {
    await Fork.create({
      preset,
      count: 1,
    });
  }
};

const addForkByPresetId = async (presetId, user) => {
  const preset = await Preset.findOne({ shortId: presetId }).populate("author");
  const fork = await Fork.findOne({ preset });
  const presetType = "custom";

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  await validateFirstFork(fork, preset);
  await addPreset(
    preset.title,
    user,
    preset.isPrivate,
    preset.thumbnailURL,
    presetType
  );

  return fork;
};

const visitPreset = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId });

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  await Preset.updateOne(
    { shortId: presetId },
    {
      viewCount: preset.viewCount + 1,
    }
  );
  return preset;
};

module.exports = {
  getPresetByUserId,
  getPresetByPresetId,
  getPresetsByPresetId,
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
  addPreset,
  addTag,
  addForkByPresetId,
  visitPreset,
};
