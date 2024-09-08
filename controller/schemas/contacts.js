const Joi = require("joi");

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

module.exports = joiValidationSchema;
