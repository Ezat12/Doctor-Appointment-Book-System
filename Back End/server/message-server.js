const Message = require("../models/messageModels");
const { asyncErrorHandler } = require("express-error-catcher");

const createMessage = asyncErrorHandler(async (req, res, next) => {
  const { message, sender, receiver } = req.body;

  const newMessage = await Message.create({
    message,
    sender,
    receivers: receiver,
  });

  res.status(200).json({ status: "success", data: newMessage });
});

const getMessage = asyncErrorHandler(async (req, res, next) => {
  const { userId } = req.params;

  const message = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  }).sort({ Timestamp: 1 });

  res.status(201).json({ state: "success", data: message });
});

const getConversation = asyncErrorHandler(async (req, res, next) => {
  const { userId1, userId2 } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 },
    ],
  }).sort({ timestamp: 1 });

  res.status(200).json({ status: "success", data: messages });
});

module.exports = {
  createMessage,
  getMessage,
  getConversation,
};
