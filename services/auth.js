const fs = require("fs");
const { imageStore } = require("../middlewares/multer");
const { User } = require("../models");

const getUserProfileByUser = (user) => {
  const profile = {
    name: user.name,
    thumbnailURL: user.thumbnailURL,
  };
  return profile;
};

const updateUserProfileByUser = async (user, thumbnailURL, name) => {
  if (user.thumbnailURL & thumbnailURL) {
    const startIndex = 4;
    const deleteFilePath = user.thumbnailURL.substring(
      startIndex,
      user.thumbnailURL.length
    );
    fs.unlinkSync("/" + deleteFilePath);
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
