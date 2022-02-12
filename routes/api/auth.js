const { Router } = require("express");
const passport = require("passport");
const { setUserToken, asyncHandler } = require("../../utils");
const {
  getUserProfileByUser,
  updateUserProfileByUser,
} = require("../../services/auth");
const { imageStore, loginRequired } = require("../../middlewares");

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

  router.get(
    "/userProfile",
    loginRequired,
    asyncHandler(async (req, res) => {
      const user = req.user;
      const profile = getUserProfileByUser(user);
      res.json(profile);
    })
  );

  router.put(
    "/userProfile",
    loginRequired,
    imageStore.single("img"),
    asyncHandler(async (req, res) => {
      const user = req.user;
      const thumbnailURL = req.file.path;
      const { name } = req.body;
      const profile = await updateUserProfileByUser(user, thumbnailURL, name);
      res.json(profile);
    })
  );

  router.get("/logout", (req, res) => {
    res.cookie("token", null, { maxAge: 0 }).json();
  });
};
