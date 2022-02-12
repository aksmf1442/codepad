const passport = require("passport");
const googleOauth = require("./strategies/google");

module.exports = () => {
  passport.use(googleOauth);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
};
