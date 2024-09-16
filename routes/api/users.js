const express = require("express");

const router = express.Router();

const ctrlUser = require("../../controller/users");
const auth = require("../../middlewares/auth");

router.post("/signup", ctrlUser.signUp);

router.post("/login", ctrlUser.login);

router.get("/logout", auth, ctrlUser.logout);

router.get("/current", auth, ctrlUser.getCurrent);

router.patch("/", auth, ctrlUser.updateSubscription);

router.get("/verify/:verificationToken", ctrlUser.verifyEmail);

router.post("/verify", ctrlUser.resendVerifyEmail);

module.exports = router;
