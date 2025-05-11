const { asyncErrorHandler } = require("express-error-catcher");
const Review = require("../models/reviewModels");
const ApiError = require("../utils/apiError");

const createReview = asyncErrorHandler(async (req, res, next) => {
  const { message, doctorId, rate } = req.body;

  const ifRateUser = await Review.findOne({ doctorId, userId: req.user._id });

  if (ifRateUser) {
    return next(new ApiError("yYou have already rated this doctor", 409));
  }

  const review = await Review.create({
    doctorId,
    userId: req.user._id,
    rate,
    message,
  });

  res.status(201).json({ status: "success", data: review });
});

const getAllReviews = asyncErrorHandler(async (req, res, next) => {
  const reviews = await Review.find({});

  res.status(201).json({ status: "success", data: reviews });
});

const updateReview = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findByIdAndUpdate(id, req.body, { new: true });

  if (!review) {
    return next(
      new ApiError("No review found for your account with this doctor", 404)
    );
  }

  if (review.userId.toString() !== req.user._id.toString()) {
    return next(
      new ApiError("You are not authorized to delete this review", 403)
    );
  }

  res.status(200).json({
    status: "success",
    data: review,
  });
});

const deleteReview = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findByIdAndDelete(id);

  if (!review) {
    return next(new ApiError("Not Found Review By id", 404));
  }

  if (req.user.id.toString() !== review.userId.toString()) {
    return next(
      new ApiError("You are not authorized to delete this review", 403)
    );
  }

  res.status(200).json({ status: "success" });
});

module.exports = {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
};
