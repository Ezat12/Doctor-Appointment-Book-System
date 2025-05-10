const Appointment = require("../models/appointmentModels");
const Doctor = require("../models/doctorModels");
const User = require("../models/userModels");
const { asyncErrorHandler } = require("express-error-catcher");
const ApiError = require("../utils/apiError");
const { sendNotification } = require("./notification-server");
const sendEmail = require("../utils/sendEmail");

const getAllAppointment = asyncErrorHandler(async (req, res, next) => {
  const appointments = await Appointment.find({});

  res.status(200).json({ statue: "success", data: appointments });
});

const getAppointmentUser = asyncErrorHandler(async (req, res, next) => {
  const appointment = await Appointment.find({ user: req.user._id });

  res.status(200).json({ status: "success", data: appointment });
});
const getAppointmentDoctor = asyncErrorHandler(async (req, res, next) => {
  const appointment = await Appointment.find({ doctor: req.user._id });

  res.status(200).json({ status: "success", data: appointment });
});

const createAppointment = asyncErrorHandler(async (req, res, next) => {
  const { idDoctor } = req.params;

  const doctor = await Doctor.findById(idDoctor);

  if (!doctor) {
    return next(new ApiError(`not found doctor by id => ${idDoctor}`, 404));
  }

  const checkAppointments = await Appointment.findOne({
    doctor: idDoctor,
    date: req.body.date,
    time: req.body.time,
  });

  if (checkAppointments) {
    return next(new ApiError("the appointment is reserved", 400));
  }

  const appointment = await Appointment.create({
    user: req.user._id,
    doctor: idDoctor,
    date: req.body.date,
    time: req.body.time,
  });

  // create notification to admin
  const io = req.app.get("io");
  const connectedUsers = req.app.get("connectedUsers");
  const admin = await User.findOne({ role: "admin" });

  await sendNotification(
    io,
    connectedUsers,
    admin._id,
    "new_appointment",
    `New Appointment Scheduled by Patient ${req.user.name} for Doctor ${
      doctor.name
    } on ${new Date().toLocaleString()}`
  );

  // create Notification to Patient
  await sendNotification(
    io,
    connectedUsers,
    req.user._id,
    "new_appointment",
    `Your Appointment with Doctor ${
      doctor.name
    } on ${new Date().toLocaleString()} has been confirmed.`
  );
  res.status(200).json({ status: "success", data: appointment });

  await sendEmail(
    "new",
    req.user.name,
    doctor.name,
    new Date().toLocaleString(),
    admin.email
  );
});

const cancelAppointment = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    {
      status: "Cancelled",
    },
    { new: true }
  );

  if (!appointment) {
    return next(new ApiError(`not found appointment by id => ${id}`, 400));
  }

  const io = req.app.get("io");
  const connectedUsers = req.app.get("connectedUsers");
  const admin = await User.findOne({ role: "admin" });

  const user = await User.findById(appointment.user);

  // Create Notification to Admin
  if (req.user.role === "admin") {
    /// Notification User
    await sendNotification(
      io,
      connectedUsers,
      user._id,
      "appointment_cancelled",
      req.user.role === "user"
        ? `The appointment with Dr. ${appointment.doctor.name} for patient ${user.name} has been cancelled`
        : `The appointment with Dr. ${appointment.doctor.name} has been cancelled by the Admin.`
    );
  } else {
    /// Notification Admin
    await sendNotification(
      io,
      connectedUsers,
      admin._id,
      "appointment_cancelled",
      req.user.role === "admin"
        ? `The appointment with Dr. ${appointment.doctor.name} for patient ${user.name} has been cancelled`
        : `The appointment with Dr. ${appointment.doctor.name} has been cancelled by the patient, ${user.name}.`
    );
  }

  res.status(201).json({ status: "success cancel", data: appointment });

  if (req.user.role === "admin") {
    // create Notification to Patient
    await sendEmail(
      "cancelled",
      user.name,
      appointment.doctor.name,
      new Date().toLocaleString(),
      user.email
    );
  } else {
    // create Notification tp admin
    await sendEmail(
      "cancelled",
      user.name,
      appointment.doctor.name,
      new Date().toLocaleString(),
      admin.email
    );
  }
});

const completedAppointment = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return next(new ApiError(`not found appointment by id => ${id}`, 400));
  }

  if (!appointment.is_paid) {
    return next(
      new ApiError(
        `The outstanding amount has not been paid by the patient yet.`,
        400
      )
    );
  }

  appointment.status = "Completed";

  await appointment.save();

  const getAppointment = await Appointment.findById(id);

  const io = req.app.get("io");
  const connectedUsers = req.app.get("connectedUsers");
  const admin = await User.findOne({ role: "admin" });

  const user = await User.findById(appointment.user);

  // Create Notification to Admin
  // await sendNotification(
  //   io,
  //   connectedUsers,
  //   admin._id,
  //   "appointment_completed",
  //   `The appointment for patient ${user.name} with Dr. ${appointment.doctor.name} has been completed.`
  // );

  // create Notification to Patient
  await sendNotification(
    io,
    connectedUsers,
    user._id,
    "appointment_completed",
    `The appointment with Dr. ${appointment.doctor.name} has been completed`
  );

  res.status(201).json({ status: "success", data: getAppointment });

  await sendEmail(
    "completed",
    user.name,
    appointment.doctor.name,
    new Date().toLocaleString(),
    user.email
  );
});

const paidAppointment = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    {
      is_paid: true,
    },
    { new: true }
  );

  if (!appointment) {
    return next(new ApiError("not found appointment by id", 404));
  }

  res.status(200).json({ status: "success", data: appointment });
});

const cancelPaidAppointment = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    {
      is_paid: false,
    },
    { new: true }
  );

  if (!appointment) {
    return next(new ApiError(`not found appointment by id => ${id}`, 400));
  }

  res.status(200).json({ status: "success", data: appointment });
});

const getAllTimeAppointmentByDay = asyncErrorHandler(async (req, res, next) => {
  const appointment = await Appointment.find({
    doctor: req.params.idDoctor,
    date: req.body.date,
    status: "Scheduled",
  });

  let timesToken = [];

  appointment.map((app) => {
    timesToken.push(app.time);
  });

  res.status(201).json({ status: "success", data: timesToken });
});

module.exports = {
  createAppointment,
  cancelAppointment,
  completedAppointment,
  getAllAppointment,
  getAllTimeAppointmentByDay,
  getAppointmentUser,
  getAppointmentDoctor,
  paidAppointment,
  cancelPaidAppointment,
};
