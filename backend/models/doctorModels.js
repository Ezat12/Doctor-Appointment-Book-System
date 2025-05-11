const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [5, "too short password"],
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
    },
    speciality: {
      type: String,
      required: [true, "speciality is required"],
    },
    weeklySchedule: [
      {
        day: {
          type: String,
          required: true,
          enum: [
            "Saturday",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
          ],
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    ],
    description: {
      type: String,
    },
    appointmentFee: {
      type: Number,
      required: [true, "appointment fee is required"],
    },
    role: {
      type: String,
      default: "doctor",
    },
    gender: {
      type: String,
    },
    birthday: String,
    image: {
      type: String,
      required: [true, "image doctor is required"],
    },
    address: String,
  },
  {
    timestamps: true,
  }
);

doctorSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("Doctor", doctorSchema);
