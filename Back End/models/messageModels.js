const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Sender Must be Required"],
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Receiver Must be Required"],
    },
    message: {
      type: String,
      required: [true, "Message Must be Required"],
    },
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
