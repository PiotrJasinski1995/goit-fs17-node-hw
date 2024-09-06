const fs = require("fs/promises");
const path = require("node:path");
const { nanoid } = require("nanoid");

const contactsPath = "./models/contacts.json";

const listContacts = async () => {
  // find file by path
  const file = await fs.readFile(path.resolve(contactsPath));
  // convert file content for string
  const fileStr = file.toString();
  // convert data to JSON
  const contacts = JSON.parse(fileStr);
  //return data
  return contacts;
};

const getContactById = async (contactId) => {
  // find file by path
  const file = await fs.readFile(path.resolve(contactsPath));
  // convert file content for string
  const fileStr = file.toString();
  // convert data to JSON
  const result = JSON.parse(fileStr);
  // find given contact
  const foundContact = result.find((contact) => contact.id === contactId);
  // return data
  return foundContact;
};

const removeContact = async (contactId) => {
  // find file by path
  const file = await fs.readFile(path.resolve(contactsPath));
  // convert file content for string
  const fileStr = file.toString();
  // convert data to JSON
  const result = JSON.parse(fileStr);
  // find given contact
  const foundContact = result.find((contact) => contact.id === contactId);

  if (foundContact) {
    // all concacts without deleted one
    const afterDelete = result.filter((contact) => contact.id !== contactId);
    // save new data to file
    await fs.writeFile(path.resolve(contactsPath), JSON.stringify(afterDelete));
    return true;
  }

  return false;
};

const addContact = async (body) => {
  // find file by path
  const file = await fs.readFile(path.resolve(contactsPath));
  // convert file content for string
  const fileStr = file.toString();
  // convert data to JSON
  const result = JSON.parse(fileStr);

  const { name, email, phone } = body;
  newContact = {
    id: nanoid(21),
    name,
    email,
    phone,
  };
  // add element to encoded array
  result.push(newContact);
  // save new data to file
  await fs.writeFile(path.resolve(contactsPath), JSON.stringify(result));
  // return data
  return newContact;
};

const updateContact = async (contactId, body) => {
  // find file by path
  const file = await fs.readFile(path.resolve(contactsPath));
  // convert file content for string
  const fileStr = file.toString();
  // convert data to JSON
  const result = JSON.parse(fileStr);
  // find given contact
  const foundContact = result.find((contact) => contact.id === contactId);

  if (foundContact) {
    // all concacts without deleted one
    const afterDelete = result.filter((contact) => contact.id !== contactId);

    const { name, email, phone } = body;
    newContact = {
      id: foundContact.id,
      name,
      email,
      phone,
    };

    // add element to encoded array
    afterDelete.push(newContact);
    // save new data to file
    await fs.writeFile(path.resolve(contactsPath), JSON.stringify(afterDelete));
    return newContact;
  }

  return undefined;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
