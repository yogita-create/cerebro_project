const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // IMPORTANT: must match Google Console exactly
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no email"), null);
        }

        let user = await User.findOne({
          email: email.toLowerCase(),
        });

        // CREATE USER
        if (!user) {
          user = await User.create({
            name,
            email: email.toLowerCase(),
            googleId: profile.id,
            avatar,
            password: null,
          });
        }

        // LINK GOOGLE IF EXISTING USER
        if (!user.googleId) {
          user.googleId = profile.id;
          user.avatar = user.avatar || avatar;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error("Google Strategy Error:", err);
        return done(err, null);
      }
    }
  )
);

/* SESSION SUPPORT (required by passport internally) */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;