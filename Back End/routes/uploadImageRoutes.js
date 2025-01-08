const express = require("express");
const { upload, uploadCloudinary } = require("../middleware/uploadImage");

const router = express.Router();

router.route("/upload-image").post(upload, uploadCloudinary);

module.exports = router;
