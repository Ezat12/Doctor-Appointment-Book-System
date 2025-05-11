const express = require("express");
const router = express.Router();

const { protectAuth } = require("../server/auth-server");
const {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
} = require("../server/review-server");

router
  .route("/")
  .get(protectAuth, getAllReviews)
  .post(protectAuth, createReview);

router
  .route("/:id")
  .put(protectAuth, updateReview)
  .delete(protectAuth, deleteReview);

module.exports = router;
