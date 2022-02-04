const { Router } = require("express");
const upload = require("../../middlewares/multer");

const router = Router();

module.exports = (app) => {
  app.use("/presets", router);

  router.post(
    "/",
    upload.fields([{ name: "img" }, { name: "sounds" }]),
    (req, res) => {
      const { title, isPrivate, tags, sounds } = req.body;
      console.log(req.file);
      console.log("-----");
      console.log(req.files);
      res.send("success");
    }
  );
};
