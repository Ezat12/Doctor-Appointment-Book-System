const { asyncErrorHandler } = require("express-error-catcher");
const Notification = require("../models/notificationModels");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");

const sendNotification = async (
  io,
  connectedUser,
  recipientId,
  type,
  message
) => {
  try {
    const notification = new Notification({
      recipientId,
      message,
      type,
    });

    await notification.save();
    const populatedNotification = await Notification.findById(notification._id);

    const socketId = connectedUser[recipientId.toString()];
    console.log("Yes");
    if (socketId) {
      io.to(socketId).emit("notification", populatedNotification);
    }
  } catch (err) {
    console.log(err);
    // if (next) return next(new ApiError("Error sending notification"));
    throw new Error("Error sending notification", err);
  }
};

const getNotificationUser = asyncErrorHandler(async (req, res, next) => {
  const notifications = await Notification.find({
    recipientId: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({ status: "success", data: notifications });
});

const readNotification = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndUpdate(
    id,
    {
      is_read: true,
    },
    { new: true }
  );

  if (!notification) {
    return next(new ApiError("not found notification by id", 404));
  }

  res.status(200).json({ status: "success", data: notification });
});

const readAllNotifications = asyncErrorHandler(async (req, res, next) => {
  const notifications = await Notification.updateMany(
    { recipientId: req.user._id },
    { $set: { is_read: true } }
  );

  const getAllNotificationsUser = await Notification.find({
    recipientId: req.user._id,
  });

  res.status(200).json({ status: "success", data: getAllNotificationsUser });
});

module.exports = {
  sendNotification,
  getNotificationUser,
  readNotification,
  readAllNotifications,
};
