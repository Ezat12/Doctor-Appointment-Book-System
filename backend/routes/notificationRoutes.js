const express = require("express");
const { protectAuth } = require("../server/auth-server");
const {
  getNotificationUser,
  readNotification,
  readAllNotifications,
} = require("../server/notification-server");

const router = express.Router();

router.get("/getNotification", protectAuth, getNotificationUser);

router.put("/read-Notification/:id", protectAuth, readNotification);
router.put("/read-All-Notification", protectAuth, readAllNotifications);

module.exports = router;
