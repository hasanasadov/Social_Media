const User = require("../mongoose/schema/user");

const update = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name } = req.matchedData;
    const avatarFile = req.file;

    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordTokenExpires"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (name) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ message: "Invalid name format!" });
      }
      user.name = name;
    }

    if (req.file) {
      user.avatar = avatarFile.path;
    }

    await user.save();
    res.status(200).json({
      message: "User updated successfulyy",
      user: { name: user.name, avatar: user.avatar },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const userController = { update };

module.exports = { userController };
