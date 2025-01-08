const { check } = require("express-validator");
const validatorError = require("../../middleware/validatorError");
const User = require("../../models/userModels");

const validatorCreateUser = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("too short user name"),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email invalid address")
    .custom(async (val) => {
      const checkEmail = await User.findOne({ email: val });
      if (checkEmail) {
        throw new Error(`The email is already token => ${val}`);
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 5 })
    .withMessage("password must be at least 5 char"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("the phone is not correct"),
  validatorError,
];

const validatorUpdateUser = [
  check("id").isMongoId().withMessage("Invalid Id"),
  check("name").optional(),
  check("email")
    .optional()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email invalid address")
    .custom(async (val) => {
      const checkEmail = await User.findOne({ email: val });
      if (checkEmail) {
        throw new Error(`the email is already taken => ${val}`);
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone"),
  validatorError,
];
const validatorDeleteUser = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatorError,
];

module.exports = {
  validatorCreateUser,
  validatorUpdateUser,
  validatorDeleteUser,
};
