const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    is_paid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

appointmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "doctor",
    select: "name image appointmentFee",
  }).populate({ path: "user", select: "name" });
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);
