const express = require("express");

const router = express.Router();

const ctrlUser = require("../../controller/users");
const auth = require("../../middlewares/auth");

router.post("/signup", ctrlUser.signUp);

router.post("/login", ctrlUser.login);

router.get("/logout", auth, ctrlUser.logout);

router.get("/current", auth, ctrlUser.getCurrent);

router.patch("/", auth, ctrlUser.updateSubscription);

module.exports = router;
