const jwt = require("jsonwebtoken");
const joiValidationSchema = require("./schemas/users");

const User = require("../service/schemas/user");
const secret = process.env.SECRET;

const signUp = async (req, res, next) => {
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
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Email is already in use",
        data: "Conflict",
      });
    }
    try {
      const subscription = "starter";
      const newUser = new User({ email, subscription });
      newUser.setPassword(password);
      await newUser.save();
      const user = { email, subscription };
      res.status(201).json({
        status: "success",
        code: 201,
        message: "Registration successful",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
};

const login = async (req, res, next) => {
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
    const { email, password } = req.body;
    const activeUser = await User.findOne({ email });

    try {
      if (!activeUser || !activeUser.validPassword(password)) {
        return res.status(400).json({
          status: "error",
          code: 400,
          message: "Incorrect login or password",
          data: "Bad request",
        });
      }

      const subscription = activeUser.subscription;
      const tokenVersion = activeUser.tokenVersion;

      const payload = {
        id: activeUser.id,
        subscription,
        tokenVersion,
      };

      const token = jwt.sign(payload, secret, { expiresIn: "1h" });
      await User.updateOne(
        { email },
        { $set: { token } },
        { runValidators: true }
      );
      const user = { email, subscription };

      res.json({
        status: "success",
        code: 200,
        data: {
          token,
          user,
        },
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
};

const logout = async (req, res, next) => {
  const user = req.user;

  try {
    await User.updateOne(
      { _id: user._id },
      { $set: { token: null }, $inc: { tokenVersion: 1 } }
    );
    res.json({
      status: "success",
      code: 200,
      message: `User ${user.email} logged out`,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  const currentUser = req.user;

  const user = {
    email: currentUser.email,
    subscription: currentUser.subscription,
  };

  try {
    res.json({
      status: "success",
      code: 200,
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  const currentUser = req.user;
  const { subscription = "starter" } = req.body;

  try {
    await User.updateOne(
      { _id: currentUser._id },
      { $set: { subscription } },
      { runValidators: true }
    );

    const user = {
      email: currentUser.email,
      subscription,
    };

    const message = subscription
      ? ". Subscription level has dropped to 'starter'"
      : "";

    res.json({
      status: "success",
      code: 200,
      message: `Subscription updated${message}`,
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = { signUp, login, logout, getCurrent, updateSubscription };
