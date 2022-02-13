const dotenv = require("dotenv");
const GoogleStrategy = require("passport-google-oauth20");
const { getUserByEmail, addUser } = require("../../utils");

dotenv.config();

const config = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:
    process.env.NODE_ENV === "production"
      ? process.env.GOOGLE_CALLBACK
      : "/auth/google/callback",
};

module.exports = new GoogleStrategy(
  config,
  async (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json;

    const currentUser = await getUserByEmail(email);
    if (!currentUser) {
      const newUser = await addUser(email, name);
      return done(null, newUser);
    }

    return done(null, currentUser);
  }
);
