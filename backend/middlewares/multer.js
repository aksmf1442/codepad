const multer = require("multer");
const { nanoid } = require("nanoid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = "";
    if (file.fieldname === "sounds") {
      dest = "uploads/sound";
    }
    if (file.fieldname === "img") {
      dest = "uploads/img";
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.substr(file.originalname.lastIndexOf("."));
    cb(null, file.fieldname + "-" + nanoid() + ext);
  },
});

module.exports = multer({ storage });
