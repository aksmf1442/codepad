const { Router } = require("express");
const passport = require("passport");
const { setUserToken } = require("../../utils/jwt");
const {
  getUserProfileByUserId,
  updateUserProfileByUserId,
} = require("../../services/auth");
const { imageStore } = require("../../middlewares/multer");

const router = Router();

module.exports = (app) => {
  app.use("/auth", router);

  router.get(
    "/google",
    passport.authenticate("google", {
      session: false,
      scope: ["profile", "email"],
    })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", { failureMessage: "로그인 실패" }),
    (req, res) => {
      const user = { id: req.user.shortId, name: req.user.name };
      setUserToken(res, user);
      res.json();
    }
  );

  router.get("/userProfile", async (req, res) => {
    const userId = req.user.id;
    const profile = await getUserProfileByUserId(userId);
    res.json(profile);
  });

  router.put("/userProfile", imageStore.single("img"), async (req, res) => {
    const userId = req.user.id;
    const thumbnailURL = req.file.path;
    const { name } = req.body;
    const profile = await updateUserProfileByUserId(userId, thumbnailURL, name);
    res.json(profile);
  });

  router.get("/logout", (req, res) => {
    res.cookie("token", null, { maxAge: 0 }).redirect("/");
  });
};
