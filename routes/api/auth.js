const { Router } = require("express");
const passport = require("passport");
const { setUserToken } = require("../../utils/jwt");
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
      setUserToken(res, req.user);
      res.redirect("/");
    }
  );

  router.get("/logout", (req, res) => {
    res.cookie("token", null, { maxAge: 0 }).redirect("/");
  });
};
