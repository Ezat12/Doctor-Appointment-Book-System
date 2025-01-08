const express = require("express");
const {
  createAppointment,
  cancelAppointment,
  completedAppointment,
  getAllAppointment,
  getAllTimeAppointmentByDay,
  getAppointmentUser,
  getAppointmentDoctor,
} = require("../server/appointment-server");
const router = express.Router();
const { protectAuth, allowedTo } = require("../server/auth-server");

router
  .route("/getAll-appointment")
  .get(protectAuth, allowedTo("admin", "user", "doctor"), getAllAppointment);

router
  .route("/get-appointmentUser")
  .get(protectAuth, allowedTo("admin", "user"), getAppointmentUser);

router
  .route("/get-appointmentDoctor")
  .get(protectAuth, allowedTo("admin", "user", "doctor"), getAppointmentDoctor);

router
  .route("/getAll-timeToken/:idDoctor")
  .post(
    protectAuth,
    allowedTo("admin", "user", "doctor"),
    getAllTimeAppointmentByDay
  );

router
  .route("/create-appointment/:idDoctor")
  .post(protectAuth, allowedTo("user", "admin"), createAppointment);

router
  .route("/cancel-appointment/:id")
  .delete(protectAuth, allowedTo("user", "admin", "doctor"), cancelAppointment);

router
  .route("/complete-appointment/:id")
  .put(protectAuth, allowedTo("admin", "doctor", "user"), completedAppointment);

module.exports = router;
