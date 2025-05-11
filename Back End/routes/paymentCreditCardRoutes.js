const express = require("express");
const router = express.Router();
const { checkOutSession } = require("../server/paymentCreditCard-server");
const { protectAuth } = require("../server/auth-server");

router.post("/create-checkout-session", protectAuth, checkOutSession);

module.exports = router;
