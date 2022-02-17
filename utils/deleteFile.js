const fs = require("fs");

const deleteImgFile = (data) => {
  const startIndex = 4;
  const deleteFilePath = data.thumbnailURL.substring(
    startIndex,
    data.thumbnailURL.length
  );
  fs.unlinkSync(deleteFilePath);
};

module.exports = { deleteImgFile };
