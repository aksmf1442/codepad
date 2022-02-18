const fs = require("fs");
const startIndex = 4;

const deleteImgFile = (data) => {
  const deleteFilePath = data.thumbnailURL.substring(
    startIndex,
    data.thumbnailURL.length
  );
  fs.unlinkSync(deleteFilePath);
};

const deleteSoundFile = (sound) => {
  const deleteFilePath = sound.URL.substring(startIndex, data.URL.length);
  fs.unlinkSync(deleteFilePath);
};

module.exports = { deleteImgFile, deleteSoundFile };
