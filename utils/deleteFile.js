const fs = require("fs");
const startIndex = 4;

const deleteFile = (data) => {
  fs.unlinkSync(data);
};

module.exports = { deleteFile };
