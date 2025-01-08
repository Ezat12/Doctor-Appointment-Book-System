const User = require("../models/userModels");
const Doctor = require("../models/doctorModels");
const { asyncErrorHandler } = require("express-error-catcher");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/apiError");

function getToken(payload) {
  return jwt.sign({ emailUser: payload }, process.env.SECRET_PRIVATE_KEY, {
    expiresIn: process.env.EXPIRED_IN,
  });
}

const singUp = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  const createUser = await User.create({
    name,
    email,
    password,
    phone,
  });

  const token = getToken(email);

  res.status(200).json({ statue: "success", user: createUser, token });
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // const comparePassword = await bcrypt.compare(password, user.password);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("the email or password is not correct", 400));
  }

  const token = getToken(email);

  res.status(200).json({ statue: "success", user, token });
});

const protectAuth = asyncErrorHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("you are not login ,please login...", 400));
  }

  const decoded = jwt.verify(token, process.env.SECRET_PRIVATE_KEY);
  console.log(decoded);

  let currentUser;

  if (decoded.emailDoctor) {
    currentUser = await Doctor.findOne({ email: decoded.emailDoctor });
  } else {
    currentUser = await User.findOne({ email: decoded.emailUser });
  }

  req.user = currentUser;
  console.log(req.user);

  next();
});

const allowedTo = (...roles) =>
  asyncErrorHandler(async (req, res, next) => {
    if (!roles.includes(req?.user?.role)) {
      return next(new ApiError("you cant not allow to access this route", 403));
    }
    next();
  });

module.exports = { singUp, login, protectAuth, allowedTo };
