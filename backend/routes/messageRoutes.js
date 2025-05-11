const express = require("express");
const { protectAuth, allowedTo } = require("../server/auth-server");
const {
  getMessage,
  createMessage,
  getConversation,
  getAllConversationToAdmin,
  readMessage,
} = require("../server/message-server");
const router = express.Router();

router.post("/", protectAuth, createMessage);
router.get(
  "/getAllConversationToAdmin",
  protectAuth,
  allowedTo("admin"),
  getAllConversationToAdmin
);
router.put("/readMessage", protectAuth, readMessage);
router.get("/:userId", protectAuth, getMessage);
router.get("/conversation/:userId1/:userId2", protectAuth, getConversation);

module.exports = router;
