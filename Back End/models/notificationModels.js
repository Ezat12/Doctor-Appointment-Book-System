const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "recipient is required"],
    },
    type: {
      type: String,
      enum: [
        "new_review",
        "new_appointment",
        "appointment_cancelled",
        "appointment_completed",
        "patient_payment",
      ],
      required: [true, "type is required"],
    },

    message: {
      type: String,
      required: [true, "message is required"],
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
