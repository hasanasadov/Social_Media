const passport = require("passport");
const express = require("express");
const cors = require("cors");
require("./config/db.js");
require("./config/auth-strategy.js");

const authRoutes = require("./routes/auth.js");
const postRoutes = require("./routes/post.js");
const commentRoutes = require("./routes/comment.js");
const userRoutes = require("./routes/user.js");
const cookieparser = require("cookie-parser");
const expressSession = require("express-session");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5103"],
    credentials: true,
  })
);
app.use(express.json());deploy
app.use(cookieparser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  console.log("Welcome to Ramazan");
  res.send("Welcome to Ramazan!");
});

app.use("/public", express.static("public"));
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
