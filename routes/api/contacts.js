const express = require("express");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

const joiValidationSchema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "any.required":
            err.message = "Missing required field: 'name'!";
            break;
          case "string.empty":
            err.message = "Name field cannot be empty!";
            break;
          case "string.min":
            err.message = `Name should have at least ${err.local.limit} characters!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  email: Joi.string()
    .trim()
    .email()
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "any.required":
            err.message = "Missing required field: 'email'!";
            break;
          case "string.empty":
            err.message = "Email address field cannot be empty!";
            break;
          case "string.email":
            err.message = `Email has wrong format!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  phone: Joi.string()
    .pattern(new RegExp(/^(\+[1-9]{1}[0-9]{3,14})?([0-9]{9,14})$/))
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "any.required":
            err.message = "Missing required field: 'phone'!";
            break;
          case "string.empty":
            err.message = "Phone number field cannot be empty!";
            break;
          case "string.pattern.base":
            err.message = `Phone number has wrong format!`;
            break;
          default:
            break;
        }
      });
      return errors;
    }),
});

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.json({ status: "success", code: 200, data: { contacts } });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (contact) {
    res.json({ status: "success", code: 200, data: { contact } });
  } else {
    res.json({ status: "failure", code: 404, message: "Not found" });
  }
});

router.post("/", async (req, res, next) => {
  const schema = joiValidationSchema;

  const validationResult = schema.validate(req.body, {
    abortEarly: false,
  });

  if (validationResult.error) {
    error_messages = validationResult.error.details.map(
      (error) => error.message
    );

    res.json({ status: "failure", code: 400, message: error_messages });
  } else {
    const contact = await addContact(req.body);
    res.json({ status: "success", code: 201, data: { contact } });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const deleteStatus = await removeContact(contactId);

  if (deleteStatus) {
    res.json({ status: "success", code: 200, message: "Contact deleted" });
  } else {
    res.json({ status: "failure", code: 404, message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const schema = joiValidationSchema;
  const { contactId } = req.params;

  const validationResult = schema.validate(req.body, {
    abortEarly: false,
  });

  if (validationResult.error) {
    error_messages = validationResult.error.details.map(
      (error) => error.message
    );

    res.json({ status: "failure", code: 400, message: error_messages });
  } else {
    const contact = await updateContact(contactId, req.body);

    if (contact) {
      res.json({ status: "success", code: 200, data: { contact } });
    } else {
      res.json({ status: "failure", code: 404, message: "Not found" });
    }
  }
});

module.exports = router;
