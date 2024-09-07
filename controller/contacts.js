const service = require("../service/contacts");
const joiValidationSchema = require("./schemas/contacts");

const get = async (req, res, next) => {
  try {
    const contacts = await service.listContacts();
    res.json({ status: "success", code: 200, data: { contacts } });
  } catch (error) {
    if (error.name === "CastError") {
      res.json({ status: "failure", code: 404, message: "Invalid ID format" });
    } else {
      console.error(error);
      next(error);
    }
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await service.getContactById(contactId);

    if (contact) {
      res.json({ status: "success", code: 200, data: { contact } });
    } else {
      res.json({ status: "failure", code: 404, message: "Not found" });
    }
  } catch (error) {
    if (error.name === "CastError") {
      res.json({ status: "failure", code: 404, message: "Invalid ID format" });
    } else {
      console.error(error);
      next(error);
    }
  }
};

const create = async (req, res, next) => {
  const schema = joiValidationSchema;

  try {
    const validationResult = schema.validate(req.body, {
      abortEarly: false,
    });

    if (validationResult.error) {
      error_messages = validationResult.error.details.map(
        (error) => error.message
      );

      res.json({ status: "failure", code: 400, message: error_messages });
    } else {
      const contact = await service.addContact(req.body);
      res.json({ status: "success", code: 201, data: { contact } });
    }
  } catch (error) {
    if (error.name === "CastError") {
      res.json({ status: "failure", code: 404, message: "Invalid ID format" });
    } else {
      console.error(error);
      next(error);
    }
  }
};

const update = async (req, res, next) => {
  const schema = joiValidationSchema;
  const { contactId } = req.params;

  try {
    const validationResult = schema.validate(req.body, {
      abortEarly: false,
    });

    if (validationResult.error) {
      error_messages = validationResult.error.details.map(
        (error) => error.message
      );

      res.json({ status: "failure", code: 400, message: error_messages });
    } else {
      const contact = await service.updateContact(contactId, req.body);

      if (contact) {
        res.json({ status: "success", code: 200, data: { contact } });
      } else {
        res.json({ status: "failure", code: 404, message: "Not found" });
      }
    }
  } catch (error) {
    if (error.name === "CastError") {
      res.json({ status: "failure", code: 404, message: "Invalid ID format" });
    } else {
      console.error(error);
      next(error);
    }
  }
};

const updateStatus = async (req, res, next) => {
  const schema = joiValidationSchema;
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    if (favorite === undefined) {
      res.json({
        status: "failure",
        code: 400,
        message: "Missing required field: 'favorite'",
      });
    } else {
      const contact = await service.updateContact(contactId, { favorite });

      if (contact) {
        res.json({ status: "success", code: 200, data: { contact } });
      } else {
        res.json({ status: "failure", code: 404, message: "Not found" });
      }
    }
  } catch (error) {
    if (error.name === "CastError") {
      res.json({ status: "failure", code: 404, message: "Invalid ID format" });
    } else {
      console.error(error);
      next(error);
    }
  }
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await service.removeContact(contactId);

    if (contact) {
      res.json({
        status: "success",
        code: 200,
        message: "Contact deleted",
        data: { contact },
      });
    } else {
      res.json({ status: "failure", code: 404, message: "Not found" });
    }
  } catch (error) {
    if (error.name === "CastError") {
      res.json({ status: "failure", code: 404, message: "Invalid ID format" });
    } else {
      console.error(error);
      next(error);
    }
  }
};

module.exports = { get, getById, create, update, updateStatus, remove };
