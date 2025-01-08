const express = require("express");
const { loginDoctor } = require("../server/auth-doctor-server");
const router = express.Router();

router.route("/login-doctor").post(loginDoctor);

module.exports = router;
