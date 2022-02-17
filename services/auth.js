const { User } = require("../models");
const { deleteImgFile } = require("../utils/deleteFile");

const getUserProfileByUser = (user) => {
  const profile = {
    name: user.name,
    thumbnailURL: user.thumbnailURL,
  };
  return profile;
};

const updateUserProfileByUser = async (user, thumbnailURL, name) => {
  if (user.thumbnailURL && thumbnailURL) {
    deleteImgFile(user);
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
