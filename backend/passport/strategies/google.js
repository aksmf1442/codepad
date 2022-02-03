const dotenv = require("dotenv");
const GoogleStrategy = require("passport-google-oauth20");
const { getUserByEmail, addUser } = require("../../services/users");

dotenv.config();

const config = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
};

module.exports = new GoogleStrategy(
  config,
  async (accessToken, refreshToken, profile, done) => {
    const { email, name, provider } = profile._json;

    const currentUser = await getUserByEmail(email);
    if (!currentUser) {
      const newUser = await addUser({
        email,
        name,
        source: provider,
      });
      return done(null, newUser);
    }

    if (currentUser.source !== "google") {
      return done(null, false, {
        message: "카카오 아이디로 가입 되어 있습니다.",
      });
    }

    return done(null, currentUser);
  }
);
