const express = require("express");

const router = express.Router();

const ctrlContact = require("../../controller/contacts");
const auth = require("../../middlewares/auth");

router.get("/", auth, ctrlContact.get);

router.get("/:contactId", auth, ctrlContact.getById);

router.post("/", auth, ctrlContact.create);

router.put("/:contactId", auth, ctrlContact.update);

router.patch("/:contactId/favorite", auth, ctrlContact.updateStatus);

router.delete("/:contactId", auth, ctrlContact.remove);

module.exports = router;
