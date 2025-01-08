const multer = require("multer");
const cloudinary = require("cloudinary");
const { asyncErrorHandler } = require("express-error-catcher");
const dotenv = require("dotenv");

dotenv.config("*");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}.${file.mimetype.split("/")[1]}`;

    cb(null, fileName);
  },
});
const upload = multer({ storage }).single("image");

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadCloudinary = asyncErrorHandler(async (req, res, next) => {
  console.log(req.body);

  const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "auto",
  });

  res.status(200).json({ statue: "success", data: uploadResult.url });
});

module.exports = { upload, uploadCloudinary };
