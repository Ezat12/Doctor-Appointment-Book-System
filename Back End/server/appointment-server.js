const Appointment = require("../models/appointmentModels");
const Doctor = require("../models/doctorModels");
const { asyncErrorHandler } = require("express-error-catcher");
const ApiError = require("../utils/apiError");

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
  console.log(req.body);

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

  res.status(200).json({ status: "success", data: appointment });
});

const cancelAppointment = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findByIdAndDelete(id);

  if (!appointment) {
    return next(new ApiError(`not found appointment by id => ${id}`, 400));
  }

  res.status(201).json({ status: "success cancel" });
});

const completedAppointment = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    {
      status: "Completed",
    },
    { new: true }
  );

  if (!appointment) {
    return next(new ApiError(`not found appointment by id => ${id}`, 400));
  }

  res.status(201).json({ status: "success", data: appointment });
});

const getAllTimeAppointmentByDay = asyncErrorHandler(async (req, res, next) => {
  console.log(req.body);

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
};
