const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Already linked to this GitHub account?
        let user = await User.findOne({ githubId: profile.id });
        if (user) return done(null, user);

        // GitHub emails can be private; fall back to a placeholder if none returned
        const email =
          profile.emails?.[0]?.value || `${profile.username}@users.noreply.github.com`;

        // Same email already registered with a password? Link the accounts.
        user = await User.findOne({ email });
        if (user) {
          user.githubId = profile.id;
          user.avatar = user.avatar || profile.photos?.[0]?.value || "";
          await user.save();
          return done(null, user);
        }

        // New user
        user = await User.create({
          email,
          githubId: profile.id,
          name: profile.displayName || profile.username,
          avatar: profile.photos?.[0]?.value || "",
        });
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Required by passport even in stateless/JWT setups because the OAuth
// handshake itself briefly uses a session to store the "state" param.
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
