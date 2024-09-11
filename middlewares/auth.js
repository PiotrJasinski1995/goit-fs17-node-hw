const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../service/schemas/user");
const secret = process.env.SECRET;

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }

    req.user = user;
    const authHeader = req.headers["authorization"];
    const token = authHeader.substring(7, authHeader.length);
    const decoded = jwt.verify(token, secret);

    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Token version is invalid",
        data: "Unauthorized",
      });
    }
    next();
  })(req, res, next);
};

module.exports = auth;
