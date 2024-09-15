const jwt = require("jsonwebtoken");
const jwtCheck = require("jwt-check-expiration");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const joiValidationSchema = require("./schemas/users");
const User = require("../service/schemas/user");
const { sendVerification } = require("../utils/email");
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
      const avatarURL = gravatar.url(email);
      const subscription = "starter";
      const verificationToken = nanoid();
      const newUser = new User({
        email,
        subscription,
        avatarURL,
        verificationToken,
      });
      newUser.setPassword(password);

      try {
        await sendVerification(newUser);

        await newUser.save();

        const user = { email, subscription, avatarURL };
        res.status(201).json({
          status: "success",
          code: 201,
          message: "Registration successful",
          data: {
            user,
          },
        });
      } catch (err) {
        return res.status(500).json({
          status: "error",
          code: 500,
          message: "Problem with sending an email",
        });
      }
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

      if (
        activeUser.token !== null &&
        !jwtCheck.isJwtExpired(activeUser.token)
      ) {
        return res.status(403).json({
          status: "error",
          code: 403,
          message: "User already logged in",
          data: "Bad request",
        });
      }

      if (!activeUser.verify) {
        return res.status(403).json({
          status: "error",
          code: 403,
          message: "User not verified",
          data: "Bad request",
        });
      }

      const subscription = activeUser.subscription;
      const tokenVersion = activeUser.tokenVersion;
      const avatarUrl = activeUser.avatarURL;

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
      const user = { email, subscription, avatarUrl };

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

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;

    if (!verificationToken)
      return res.status(404).json({ message: "User not found" });

    const verifiedUser = await User.findOne({ verificationToken });

    if (verifiedUser) {
      verifiedUser.verificationToken = null;
      verifiedUser.verify = true;

      await verifiedUser.save();

      const user = {
        email: verifiedUser.email,
        subscription: verifiedUser.subscription,
        verificationToken: verifiedUser.verificationToken,
        verify: verifiedUser.verify,
      };

      res.json({
        status: "success",
        code: 200,
        message: "Verification successful",
        user,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }

  sendVerification(user);
  res.json({
    status: "success",
    code: 200,
    email,
    message: "Verification email sent",
  });
};

module.exports = {
  signUp,
  login,
  logout,
  getCurrent,
  updateSubscription,
  verifyEmail,
  resendVerifyEmail,
};
