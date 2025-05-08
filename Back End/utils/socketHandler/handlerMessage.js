const Message = require("../../models/messageModels");
const User = require("../../models/userModels");

handlerMessage = async (io, socket, data) => {
  try {
    const { message, sender, receiver } = data;

    const senderUser = await User.findById(sender);
    const receiverUser = await User.findById(receiver);

    if (!senderUser || !receiverUser) {
      throw new Error("Sender or receiver not found");
    }

    const newMessage = await Message.create({
      message,
      sender,
      receiver,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "_id name role")
      .populate("receiver", "_id name role");

    io.to(socket.id).emit("newMessage", populatedMessage);
    socket.broadcast.emit("newMessage", populatedMessage);
  } catch (error) {
    console.error("Error handling message:", error);
    socket.emit("error", { message: "Failed to send message" });
  }
};

module.exports = {
  handlerMessage,
};
