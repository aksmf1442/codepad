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
    isPrivate: preset.isPrivate,
    soundSamples,
  };
};

const getPresetByUserId = async (userId) => {
  const user = await User.findOne({ shortId: userId });
  const preset = await Preset.find({ author: user })
    .sort({
      updatedAt: "desc",
    })
    .limit(1);

  if (!preset) {
    throw new Error("");
  }

  const soundSamples = await getSoundSamplesByPreset(preset);

  return parsePresetData(preset, soundSamples);
};

const getPresetByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId });

  if (!preset) {
    throw new Error("");
  }

  const soundSamples = await getSoundSamplesByPreset(preset);

  return parsePresetData(preset, soundSamples);
};

const getCommunityCount = async (preset) => {
  const viewCount = preset.viewCount;
  const likeCount = await Like.countDocuments({ preset });
  const commentCount = await Comment.countDocuments({ preset });
  return { viewCount, likeCount, commentCount };
};

const getPresetsByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId }).populate("author");

  if (!preset) {
    throw new Error("");
  }

  let presets = await Preset.find({ author: preset.author });

  presets = await Promise.all(
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

  return presets;
};

const getTagsByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId });

  if (!preset) {
    throw new Error("");
  }

  let tags = await Tag.find({ preset });
  tags = tags.map((tag) => tag.text);

  return tags;
};

const getCommunityCountByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId });

  if (!preset) {
    throw new Error("");
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

const getCommentsByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId });

  if (!preset) {
    throw new Error("");
  }

  let comments = await Comment.find({ preset })
    .sort({
      updatedAt: "desc",
    })
    .populate("author");

  comments = parseComments(comments);
  return comments;
};

const addComment = async (presetId, userId, text) => {
  const user = await User.findOne({ shortId: userId });
  const preset = await Preset.findOne({ shortId: presetId });

  if (!user || !preset) {
    throw new Error("");
  }

  const comment = await Comment.create({
    shortId: nanoid(),
    author: user,
    preset: preset,
    text,
  });
  return comment;
};

const updateCommentByCommentId = async (commentId, text) => {
  const comment = await Comment.findOneAndUpdate(
    { shortId: commentId },
    { text }
  );

  if (!comment) {
    throw new Error("");
  }

  return comment;
};

const deleteCommentByCommentId = async (commentId) => {
  const comment = await Comment.findOneAndDelete({ shortId: commentId });

  if (!comment) {
    throw new Error("");
  }

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

const getLikeClickedState = async (click, presetId, userId) => {
  const user = await User.findOne({ shortId: userId });
  const preset = await Preset.findOne({ shortId: presetId });

  if (!user || !preset) {
    throw new Error("");
  }

  const like = await validateClickAndGetLike(click, user, preset);
  let isCliked = true;
  if (like === null) {
    isCliked = false;
  }
  return isCliked;
};

const addPreset = async (title, userId, isPrivate, thumbnailURL) => {
  if (!title || !isPrivate) {
    throw new Error("");
  }
  const size = 8;
  const user = await User.findOne({ shortId: userId });
  const preset = await Preset.create({
    shortId: nanoid(),
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
    throw new Error("");
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
      count: 0,
    });
  }
};

const addForkByPresetId = async (presetId, userId) => {
  const preset = await Preset.findOne({ shortId: presetId }).populate("author");
  const user = await User.findOne({ shortId: userId });
  const fork = await Fork.findOne({ preset });

  if (!user || !preset) {
    throw new Error("");
  }

  await validateFirstFork(fork, preset);
  await addPreset(preset.title, userId, preset.isPrivate, preset.thumbnailURL);

  return fork;
};

const visitPreset = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId });

  if (!preset) {
    throw new Error("");
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
