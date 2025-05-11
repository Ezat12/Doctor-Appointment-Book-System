const { asyncErrorHandler } = require("express-error-catcher");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorModels");
const ApiError = require("../utils/apiError");

const loginDoctor = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email });
  if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
    return next(new ApiError("the email or password is not correct", 400));
  }

  const token = jwt.sign(
    { emailDoctor: email },
    process.env.SECRET_PRIVATE_KEY,
    { expiresIn: process.env.EXPIRED_IN }
  );

  res.status(200).json({ doctor, token });
});

module.exports = {
  loginDoctor,
};
