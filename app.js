const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");

const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");
const avatarRouter = require("./routes/api/avatars");

const app = express();
app.use(express.static(path.resolve(__dirname, "./public")));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

require("./config/config-passport");

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);
app.use("/api/users/avatars", avatarRouter);

app.use((_req, res, _next) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
