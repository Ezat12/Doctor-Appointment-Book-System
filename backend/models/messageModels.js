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
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sender",
    select: "_id name email phone gender role",
  }).populate({
    path: "receiver",
    select: "_id name email phone gender role",
  });
  next();
});

module.exports = mongoose.model("Message", messageSchema);
