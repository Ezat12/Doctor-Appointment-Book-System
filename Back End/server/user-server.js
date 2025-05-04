const User = require("../models/userModels");
const { asyncErrorHandler } = require("express-error-catcher");
const ApiError = require("../utils/apiError");

const createUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  });

  res.status(200).json({ status: "success", user });
});

const getAllUser = asyncErrorHandler(async (req, res, next) => {
  const allUser = await User.find({});

  res.status(200).json({ status: "success", user: allUser });
});

const getSpecifyUser = asyncErrorHandler(async (req, res, next) => {
  let id;
  if (req.user._id) {
    id = req.user._id;
  } else {
    id = req.params.id;
  }
  const user = await User.findById(id);

  if (!user) {
    return next(new ApiError(`not found user ny id => ${id}`));
  }

  res.status(200).json({ status: "success", user });
});

const updateUser = asyncErrorHandler(async (req, res, next) => {
  let id;
  if (req.user._id) {
    id = req.user._id;
  } else {
    id = req.params.id;
  }
  const user = await User.findByIdAndUpdate(id, req.body, { new: true });

  if (!user) {
    return next(new ApiError(`not found user ny id => ${id}`));
  }

  res.status(200).json({ status: "success update", user });
});

const deleteUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return next(new ApiError(`not found user ny id => ${id}`));
  }

  res.status(200).json({ status: "success deleted" });
});

const getAdmins = asyncErrorHandler(async (req, res, next) => {
  const admins = await User.find({ role: "admin" }).select("_id name email");

  res.status(200).json({
    status: "success",
    data: {
      admins,
    },
  });
});

module.exports = {
  createUser,
  getAllUser,
  getSpecifyUser,
  updateUser,
  deleteUser,
  getAdmins,
};
