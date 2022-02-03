const { Router } = require("express");
const passport = require("passport");
const { setUserToken } = require("../utils/jwt");
const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    setUserToken(res, req.user);
    res.redirect("/");
  }
);

module.exports = router;
