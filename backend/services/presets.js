const {
  Preset,
  User,
  Instrument,
  Visit,
  Like,
  Comment,
  Tag,
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
  const soundSamples = await getSoundSamplesByPreset(preset);

  return parsePresetData(preset, soundSamples);
};

const getPresetByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId });

  const soundSamples = await getSoundSamplesByPreset(preset);

  return parsePresetData(preset, soundSamples);
};

const getCommunityCount = async (preset) => {
  const viewCount = await Visit.countDocuments({ preset });
  const likeCount = await Like.countDocuments({ preset });
  const commentCount = await Comment.countDocuments({ preset });

  return { viewCount, likeCount, commentCount };
};

const getPresetsByPresetId = async (presetId) => {
  let presets = await Preset.find({ shortId: presetId }).sort({
    updatedAt: "desc",
  });
  presets = presets.map(async (preset) => {
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
  });

  return presets;
};

const getTagsByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId });
  let tags = await Tag.find({ preset });
  tags = tags.map((tag) => tag.text);

  return tags;
};

const getCommunityCountByPresetId = async (presetId) => {
  const preset = await Preset.findOne({ shortId: presetId });
  const { viewCount, likeCount, commentCount } = await getCommunityCount(
    preset
  );

  return { viewCount, likeCount, commentCount };
};

module.exports = {
  getPresetByUserId,
  getPresetByPresetId,
  getPresetsByPresetId,
  getTagsByPresetId,
  getCommunityCountByPresetId,
};
