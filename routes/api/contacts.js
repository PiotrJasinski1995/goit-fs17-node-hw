const express = require("express");

const router = express.Router();
const ctrlContact = require("../../controller/contacts");

router.get("/", ctrlContact.get);

router.get("/:contactId", ctrlContact.getById);

router.post("/", ctrlContact.create);

router.put("/:contactId", ctrlContact.update);

router.patch("/:contactId/favorite", ctrlContact.updateStatus);

router.delete("/:contactId", ctrlContact.remove);

module.exports = router;
