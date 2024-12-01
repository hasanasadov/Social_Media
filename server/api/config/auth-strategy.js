const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const User = require("../mongoose/schema/user");
const { comparePassword } = require("../utils/bcrypt");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id).select(
      "-password -__v -resetPasswordToken -resetPasswordTokenExpires"
    );
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { error: "Invalid Credentials!" });
        }

        if (!comparePassword(password, user.password)) {
          return done(null, false, { error: "Invalid Credentials!" });
        }

        if (user.isBlocked) {
          return done(null, false, { error: "User is blocked!" });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
