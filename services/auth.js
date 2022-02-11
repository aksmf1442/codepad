const { User } = require("../models");

const getUserProfileByUserId = async (userId) => {
  const user = await User.findOne({ shortId: userId });

  if (!user) {
    throw new Error("");
  }

  const profile = {
    name: user.name,
    thumbnailURL: user.thumbnailURL,
  };
  return profile;
};

const updateUserProfileByUserId = async (userId, thumbnailURL, name) => {
  const user = await User.findOneAndUpdate(
    { shortId: userId },
    { name, thumbnailURL }
  );

  if (!user) {
    throw new Error("");
  }

  return user;
};

module.exports = { getUserProfileByUserId, updateUserProfileByUserId };
