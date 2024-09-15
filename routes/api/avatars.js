const express = require("express");
const path = require("path");
const multer = require("multer");

const router = express.Router();

const ctrlAvatar = require("../../controller/avatars");
const auth = require("../../middlewares/auth");

const tempDir = path.join(__dirname, "../../tmp");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tempDir);
  },
  filename: (_req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.patch("/", auth, upload.single("avatar"), ctrlAvatar.uploadAvatar);

module.exports = router;
