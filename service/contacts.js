const Contact = require("./schemas/contact");

const listContacts = async (page, limit, favorite, owner) => {
  if (favorite === undefined) {
    return Contact.find({ owner })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  return Contact.find({ favorite, owner })
    .skip((page - 1) * limit)
    .limit(limit);
};

const getContactById = (id, owner) => {
  return Contact.findOne({ _id: id, owner });
};

const addContact = (body) => {
  return Contact.create(body);
};

const updateContact = (id, body) => {
  return Contact.findByIdAndUpdate({ _id: id }, body, { new: true });
};

const removeContact = (id) => {
  return Contact.findByIdAndDelete({ _id: id });
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
