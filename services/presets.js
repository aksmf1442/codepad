const { nanoid } = require("nanoid");
const {
  Preset,
  User,
  Instrument,
  Like,
  Comment,
  Tag,
  SoundSample,
  Fork,
} = require("../models");
const { deleteFile } = require("../utils/deleteFile");

const getSoundSamplesByPreset = async (preset) => {
  let soundSamples = await Instrument.find({ preset }).populate("soundSample");

  soundSamples = soundSamples.map((ins) => {
    return {
      location: {
        x: ins.xCoordinate,
        y: ins.yCoordinate,
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
    userId: preset.author.id,
    presetTitle: preset.title,
    presetId: preset.shortId,
    areaSize: preset.size,
    thumbnailURL: preset.thumbnailURL,
    soundSamples,
  };
};

const getPresetByUserId = async (userId) => {
  const user = await User.findOne({ shortId: userId });
  let preset = await Preset.find({ author: user })
    .where("isPrivate")
    .equals(false)
    .sort({
      updatedAt: "desc",
    })
    .limit(1)
    .populate("author");

  preset = preset[0];
  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }
  await visitPreset(preset);
  const soundSamples = await getSoundSamplesByPreset(preset);

  return parsePresetData(preset, soundSamples);
};

const getPresetByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId }).populate("author");

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  await visitPreset(preset);
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

const getDefaultPresets = async (skip, limit) => {
  const presetType = "default";
  let presets = await Preset.find({ presetType })
    .sort({
      updatedAt: "desc",
    })
    .skip(skip)
    .limit(limit);

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
        thumbnailImageURL: preset.thumbnailURL,
        reactions: {
          viewCount,
          likeCount,
          commentCount,
        },
      };
    })
  );
};

const getMyPresets = async (skip, limit, user) => {
  let presets = await Preset.find({ author: user })
    .sort({
      updatedAt: "desc",
    })
    .skip(skip)
    .limit(limit);

  presets = await parsePresetsData(presets);

  return presets;
};

const getPresetsByPresetId = async (skip, limit, presetId) => {
  const preset = await Preset.findOne({ shortId: presetId }).populate("author");

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  let presets = await Preset.find({ author: preset.author })
    .where("isPrivate")
    .equals(false)
    .sort({ updatedAt: "desc" })
    .skip(skip)
    .limit(limit);

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
      createdAt: "desc",
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
  const comment = await Comment.findOne({ shortId: commentId })
    .populate("author")
    .populate({ path: "preset", populate: "author" });

  if (!comment) {
    throw new Error("댓글 정보가 없습니다.");
  }

  if (
    user.shortId !== comment.preset.author.shortId &&
    user.shortId !== comment.author.shortId
  ) {
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
  if (!title || isPrivate === undefined) {
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

const updatePresetByPresetId = async (
  presetId,
  title,
  isPrivate,
  thumbnailURL
) => {
  let preset = await Preset.findOne({ shortId: presetId });

  if (preset.thumbnailURL && thumbnailURL) {
    deleteFile(preset.thumbnailURL);
  }

  preset = await Preset.findOneAndUpdate(
    { shortId: presetId },
    {
      title: !title ? preset.title : title,
      isPrivate: isPrivate === undefined ? preset.isPrivate : isPrivate,
      thumbnailURL: !thumbnailURL ? preset.thumbnailURL : thumbnailURL,
    }
  );
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

  const [x, y] = location.split("X");

  const preset = await Preset.findOne({ shortId: presetId });

  const instrument = await Instrument.create({
    preset,
    soundSample,
    xCoordinate: x,
    yCoordinate: y,
    buttonType,
    soundType,
  });

  return instrument;
};

const deleteInstrument = async (preset, instrument, x, y) => {
  deleteFile(instrument.soundSample.URL);
  await SoundSample.findOneAndDelete({
    shortId: instrument.soundSample.shortId,
  });
  await Instrument.findOneAndDelete({
    preset,
    xCoordinate: x,
    yCoordinate: y,
  });
};

const updateSoundFileToInstrument = async (
  preset,
  instrument,
  buttonType,
  soundType,
  soundSampleURL,
  newSoundSampleURL,
  x,
  y
) => {
  deleteFile(soundSampleURL);
  await SoundSample.findOneAndUpdate(
    { shortId: instrument.soundSample.shortId },
    {
      URL: newSoundSampleURL,
    }
  );
  await Instrument.findOneAndUpdate(
    {
      preset,
      xCoordinate: x,
      yCoordinate: y,
    },
    {
      buttonType,
      soundType,
    }
  );
};

const updateOnlyTextDataToInstrument = async (
  preset,
  x,
  y,
  buttonType,
  soundType
) => {
  await Instrument.findOneAndUpdate(
    {
      preset,
      xCoordinate: x,
      yCoordinate: y,
    },
    {
      buttonType,
      soundType,
    }
  );
};

const updateInstrument = async (
  presetId,
  location,
  buttonType,
  soundType,
  soundSampleURL,
  newSoundSampleURL
) => {
  const preset = await Preset.findOne({ shortId: presetId });
  const [x, y] = location.split("X");
  const instrument = await Instrument.findOne({
    preset,
    xCoordinate: x,
    yCoordinate: y,
  }).populate("soundSample");

  if (instrument) {
    if (!newSoundSampleURL && !soundSampleURL) {
      deleteInstrument(preset, instrument, x, y);
    } else if (newSoundSampleURL) {
      updateSoundFileToInstrument(
        preset,
        instrument,
        buttonType,
        soundType,
        soundSampleURL,
        newSoundSampleURL,
        x,
        y
      );
    } else {
      updateOnlyTextDataToInstrument(preset, x, y, buttonType, soundType);
    }
  } else {
    if (newSoundSampleURL) {
      await addInstrument(
        preset.shortId,
        location,
        buttonType,
        soundType,
        newSoundSampleURL
      );
    }
  }
};

const addTag = async (preset, text) => {
  const tag = await Tag.create({ preset, text });
  return tag;
};

const deleteTags = async (preset) => {
  await Tag.deleteMany({ preset });
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

const getForkCountByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId }).populate("author");
  const fork = await Fork.findOne({ preset });
  let forkCount = 0;
  if (fork) {
    forkCount = fork.count;
  }
  return forkCount;
};

const addForkByPresetId = async (presetId, user) => {
  const preset = await Preset.findOne({ shortId: presetId }).populate("author");
  const fork = await Fork.findOne({ preset });
  const presetType = "custom";

  if (!preset) {
    throw new Error("프리셋 정보가 없습니다.");
  }

  await addPreset(
    preset.title,
    user,
    preset.isPrivate,
    preset.thumbnailURL,
    presetType
  );
  await validateFirstFork(fork, preset);

  return fork;
};

const visitPreset = async (preset) => {
  await Preset.updateOne(
    { shortId: preset.shortId },
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
  updateInstrument,
  addPreset,
  updatePresetByPresetId,
  addTag,
  deleteTags,
  addForkByPresetId,
  visitPreset,
  getForkCountByPresetId,
};
