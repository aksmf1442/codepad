const multer = require("multer");
const { nanoid } = require("nanoid");

const store = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const dest = `uploads/${folder}`;
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.substr(file.originalname.lastIndexOf("."));
      cb(null, file.fieldname + "-" + nanoid() + ext);
    },
  });

const soundStore = multer({ storage: store("sound") });
const imageStore = multer({ storage: store("img") });

module.exports = { soundStore, imageStore };
