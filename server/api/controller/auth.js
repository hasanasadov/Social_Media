const User = require("../mongoose/schema/user");
const { hashPassword } = require("../utils/bcrypt");
const crypto = require("crypto");
const { transporter } = require("../utils/mail");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields!" });
    }

    const alreadyExists = await User.findOne({ email });

    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const user = new User({
      email,
      password: hashPassword(password),
      name,
      boxes: [{ items: [], totalPrice: 0, totalQuantity: 0 }],
    });

    await user.save();

    res.send({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const user = req.user.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordTokenExpires;
  res.send({ message: "User logged in successfully.", user });
  // try {
  //   const { email, password } = req.body;

  //   if (!email || !password) {
  //     return res.status(400).json({ message: "Please fill in all fields!" });
  //   }

  //   const user = await User.findOne({ email });
  //   if (!user) {
  //     return res.status(400).json({ message: "Invalid credentials!" });
  //   }

  //   if (!comparePassword(password, user.password)) {
  //     return res.status(400).json({ message: "Invalid credentials!" });
  //   }

  //   if (user.isBlocked) {
  //     return res.status(403).json({ message: "Your account is blocked!" });
  //   }

  //   req.session.userId = user?._id;

  //   res.send({ message: "User logged in successfully." });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ message: "Internal server error!" });
  // }
};

const currentUser = async (req, res) => {
  const user = req.user.toObject();
  user.avatar = `${process.env.BASE_URL}${user.avatar}`;
  res.json({ user });
};

const logout = async (req, res) => {
  // req.session.destroy((err) => {
  //   if (err) {
  //     return res.status(500).json({ message: "Internal server error!" });
  //   }
  //   res.clearCookie("connect.sid");
  //   res.send({ message: "Logged out successfully." });
  // });
  req.logout(function (err) {
    if (err) {
      res.status(500).json({ message: "Internal server error!" });
    }
    res.send({ message: "User logged out successfully." });
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = Date.now() + 1000 * 60 * 15;
    await user.save();

    await transporter.sendMail({
      from: '"Passport Auth 👻" <nuraddinvr@code.edu.az>',
      to: email,
      subject: "Reset Password",
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 10px; border: 1px solid #e0e0e0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Reset Your Password</h2>
            <p style="font-size: 16px; color: #555;">Hi, ${user.name},</p>
            <p style="font-size: 16px; color: #555; margin-bottom: 20px;">You requested to reset your password. To proceed, click the button below:</p>

            <a href="${process.env.CLIENT_URL}/reset-password/${token}" target="_blank" 
              style="display: inline-block; padding: 12px 25px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px; text-align: center; font-weight: bold;">
              Reset Password
            </a>

            <p style="font-size: 16px; color: #555; margin-bottom: 20px;">If you didn’t request this, you can safely ignore this email.</p>
            <p style="font-size: 16px; color: #555;">Thanks,<br>The Passport Auth Team</p>

            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;"/>

            <p style="font-size: 14px; color: #777; text-align: center;">If the button above doesn't work, copy and paste the following link into your browser:</p>
            <p style="font-size: 14px; color: #007BFF; text-align: center;">
              <a href="${process.env.CLIENT_URL}/reset-password/${token}" style="color: #007BFF; text-decoration: none;">${process.env.CLIENT_URL}/reset-password/${token}</a>
            </p>
          </div>`,
    });
    res.json({ message: "Password reset email sent successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token!" });
    }

    user.password = hashPassword(password);
    user.resetPasswordToken = "";
    user.resetPasswordTokenExpires = "";

    await user.save();

    res.json({ message: "Password reset succesfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const authController = {
  register,
  login,
  currentUser,
  logout,
  forgotPassword,
  resetPassword,
};

module.exports = {
  authController,
};
