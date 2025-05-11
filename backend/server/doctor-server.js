const Doctor = require("../models/doctorModels");
const { asyncErrorHandler } = require("express-error-catcher");
const ApiError = require("../utils/apiError");

const createDoctor = asyncErrorHandler(async (req, res, next) => {
  const doctor = await Doctor.create(req.body);

  res.status(200).json({ status: "success", doctor });
});

const getAllDoctors = asyncErrorHandler(async (req, res, next) => {
  const allDoctors = await Doctor.find({});

  res.status(200).json({ status: "success", doctors: allDoctors });
});

const getSpecifyDoctor = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const doctor = await Doctor.findById(id);

  if (!doctor) {
    return next(new ApiError(`not found doctor ny id => ${id}`));
  }

  res.status(200).json({ status: "success", doctor });
});

const getDataDoctorLogged = asyncErrorHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.user._id);

  if (!doctor) {
    return next(new ApiError("not found doctor", 404));
  }

  res.status(200).json({ status: "success", doctor });
});

const updateDoctor = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const doctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true });

  if (!doctor) {
    return next(new ApiError(`not found doctor ny id => ${id}`));
  }

  res.status(200).json({ status: "success update", doctor });
});

const deleteDoctor = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const doctor = await Doctor.findByIdAndDelete(id);

  if (!doctor) {
    return next(new ApiError(`not found doctor ny id => ${id}`));
  }

  res.status(200).json({ status: "success deleted" });
});

const addWeeklySchedule = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const { schedule } = req.body;

  const doctor = await Doctor.findByIdAndUpdate(
    id,
    {
      weeklySchedule: schedule,
    },
    { new: true }
  );

  if (!doctor) {
    return next(new ApiError(`not found doctor by id => ${id}`));
  }

  res.status(201).json({ statue: "success", doctor });
});

module.exports = {
  createDoctor,
  getAllDoctors,
  getSpecifyDoctor,
  updateDoctor,
  deleteDoctor,
  addWeeklySchedule,
  getDataDoctorLogged,
};
