const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.ObjectId,
      ref: "Doctor",
      required: [true, "doctor id is required"],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "user id is required"],
    },
    rate: {
      type: Number,
      min: [0, "rate cannot be less than 0"],
      max: [5, "rate cannot exceed 5"],
    },
    message: {
      type: String,
      required: [true, "message is required"],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.virtual("User", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("Reviews", reviewSchema);
