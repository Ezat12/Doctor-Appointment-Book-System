const express = require("express");
const { validatorCreateUser } = require("../utils/validation/validatorUser");
const { singUp, login } = require("../server/auth-server");
const router = express.Router();

router.route("/signup").post(validatorCreateUser, singUp);
router.route("/login").post(login);

module.exports = router;
