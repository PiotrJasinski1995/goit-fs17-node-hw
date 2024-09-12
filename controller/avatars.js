const fs = require("fs");
const path = require("node:path");
const { Jimp } = require("jimp");
const User = require("../service/schemas/user");

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const avatarFile = req.file;

    if (!avatarFile) {
      return res.status(400).json({ message: "Avatar file is required" });
    }

    const jimpImage = await Jimp.read(avatarFile.path);
    jimpImage.resize({ w: 100, h: 100 });
    await jimpImage.write(path.join(avatarDir, avatarFile.filename));

    const fileName = `${userId}-${Date.now()}${path.extname(
      avatarFile.originalname
    )}`;

    fs.renameSync(
      path.join(avatarDir, avatarFile.filename),
      path.join(avatarDir, fileName)
    );

    const user = await User.findById(userId);
    user.avatarURL = `/avatars/${fileName}`;
    await user.save();

    res.status(200).json({
      status: "success",
      code: 200,
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

module.exports = { uploadAvatar };
