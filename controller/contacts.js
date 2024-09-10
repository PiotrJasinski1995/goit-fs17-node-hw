const service = require("../service/contacts");
const joiValidationSchema = require("./schemas/contacts");

const get = async (req, res, next) => {
  const page = 0;

  // default page = 1, default limit = 10
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 10,
  };

  const favorite = req.query.favorite;

  try {
    const contacts = await service.listContacts(
      pageOptions.page,
      pageOptions.limit,
      favorite,
      req.user._id
    );
    res.json({ status: "success", code: 200, data: { contacts } });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await service.getContactById(contactId, req.user._id);

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
  const user = req.user;

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
      const contactBody = req.body;
      contactBody.owner = req.user._id;
      const contact = await service.addContact(contactBody);
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
      const contactBody = req.body;
      contactBody.owner = req.user._id;
      const contact = await service.updateContact(contactId, contactBody);

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
      const contactBody = { favorite };
      contactBody.owner = req.user._id;
      const contact = await service.updateContact(contactId, contactBody);

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
    const contact = await service.removeContact(contactId, req.user._id);

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
