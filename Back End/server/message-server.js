const Message = require("../models/messageModels");
const User = require("../models/userModels");
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

const getAllConversationToAdmin = asyncErrorHandler(async (req, res, next) => {
  const getAllMessage = await Message.find({ receiver: req.user._id });

  let messagesToAdmin = [];

  getAllMessage.map((message, i) => {
    const findMessage = messagesToAdmin.findIndex(
      (m) => m?.user._id?.toString() === message.sender._id.toString()
    );

    if (findMessage === -1) {
      messagesToAdmin.push({
        user: message.sender,
        notRead: message.is_read ? 0 : 1,
      });
    } else {
      if (!message.is_read) {
        messagesToAdmin[findMessage].notRead += 1;
      }
    }
  });

  res.status(200).json({ status: "success", data: messagesToAdmin });
});

const readMessage = asyncErrorHandler(async (req, res, next) => {
  const { sender, receiver } = req.body;

  const messages = await Message.updateMany(
    { sender, receiver },
    {
      $set: { is_read: true },
    }
  );

  const getMessage = await Message.find({ sender, receiver });

  res.status(200).json({ status: "success update", data: getMessage });
});

module.exports = {
  createMessage,
  getMessage,
  getConversation,
  getAllConversationToAdmin,
  readMessage,
};
