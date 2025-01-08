const express = require("express");

const router = express.Router();

const { protectAuth, allowedTo } = require("../server/auth-server");
const {
  validatorCreateDoctor,
  validatorUpdateDoctor,
  validatorDeleteDoctor,
} = require("../utils/validation/validatorDoctor");
const {
  createDoctor,
  getAllDoctors,
  getSpecifyDoctor,
  updateDoctor,
  deleteDoctor,
  addWeeklySchedule,
  getDataDoctorLogged,
} = require("../server/doctor-server");

router
  .route("/getData-doctor")
  .get(protectAuth, allowedTo("admin", "doctor"), getDataDoctorLogged);

router
  .route("/")
  .post(protectAuth, allowedTo("admin"), validatorCreateDoctor, createDoctor)
  .get(getAllDoctors);

router
  .route("/weeklySchedule/:id")
  .put(protectAuth, allowedTo("admin", "doctor"), addWeeklySchedule);

router
  .route("/:id")
  .get(getSpecifyDoctor)
  .put(
    protectAuth,
    allowedTo("admin", "doctor"),
    validatorUpdateDoctor,
    updateDoctor
  )
  .delete(protectAuth, allowedTo("admin"), validatorDeleteDoctor, deleteDoctor);

module.exports = router;
