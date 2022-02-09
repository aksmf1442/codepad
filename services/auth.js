const { User } = require("../models");

const getUserProfileByUserId = async (userId) => {
  const user = await User.findOne({ shortId: userId });
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
  return user;
};

module.exports = { getUserProfileByUserId, updateUserProfileByUserId };
