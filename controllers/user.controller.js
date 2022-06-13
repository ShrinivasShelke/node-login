const bcrypt = require("bcrypt");
const HttpError = require("../utils/http-error");
const db = require("../models");
const User = db.user;

const login = async (req, res, next) => {
  const { username, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ where: { username: username } });
  } catch (err) {
    const error = new HttpError(
      "Invalid credentials, please check your email and try again.",
      400
    );
    return next(error);
  }
  let isValidpass = false;
  try {
    isValidpass = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      400
    );
    return next(error);
  }
  if (!isValidpass) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      400
    );
    return next(error);
  }
  res.json({
    userId: existingUser.id,
  });
};

exports.login = login;
