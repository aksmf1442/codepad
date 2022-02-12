const { User } = require("../models");

const getUserProfileByUser = (user) => {
  const profile = {
    name: user.name,
    thumbnailURL: user.thumbnailURL,
  };
  return profile;
};

const updateUserProfileByUser = async (user, thumbnailURL, name) => {
  await User.updateOne({ shortId: user.shortId }, { name, thumbnailURL });

  return getUserProfileByUser(user);
};

module.exports = { getUserProfileByUser, updateUserProfileByUser };
