const { User } = require("../models");
const { deleteFile } = require("../utils/deleteFile");

const getUserProfileByUser = (user) => {
  const profile = {
    name: user.name,
    thumbnailURL: user.thumbnailURL,
    userId: user.shortId,
  };
  return profile;
};

const updateUserProfileByUser = async (user, thumbnailURL, name) => {
  if (user.thumbnailURL && thumbnailURL) {
    deleteFile(user.thumbnailURL);
  }
  await User.findOneAndUpdate(
    { shortId: user.shortId },
    {
      name,
      thumbnailURL: !thumbnailURL ? user.thumbnailURL : thumbnailURL,
    }
  );

  return getUserProfileByUser(user);
};

module.exports = { getUserProfileByUser, updateUserProfileByUser };
