const express = require("express");
const { protectAuth } = require("../server/auth-server");
const {
  getMessage,
  createMessage,
  getConversation,
} = require("../server/message-server");
const router = express.Router();

router.post("/", protectAuth, createMessage);
router.get("/:userId", protectAuth, getMessage);
router.get("/conversation/:userId1/:userId2", protectAuth, getConversation);

module.exports = router;
