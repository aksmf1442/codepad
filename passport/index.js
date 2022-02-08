const passport = require("passport");
const jwt = require("./strategies/jwt");
const googleOauth = require("./strategies/google");

module.exports = () => {
  passport.use(jwt);
  passport.use(googleOauth);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
};