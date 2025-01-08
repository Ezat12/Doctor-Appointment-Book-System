const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const ApiError = require("./utils/apiError");
const dbConnection = require("./config/dbConnection");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const uploadRoute = require("./routes/uploadImageRoutes");
const doctorRoute = require("./routes/doctorRoutes");
const authDoctorRoute = require("./routes/authDoctorRoutes");
const appointmentRoute = require("./routes/appointmentRoutes");

app.use(morgan("dev"));
app.use(cors("*"));
dotenv.config();

app.use(express.json());

dbConnection();

app.use("/user", userRoute);

app.use("/", authRoute);

app.use("/", authDoctorRoute);

app.use("/", uploadRoute);

app.use("/doctor", doctorRoute);

app.use("/appointment", appointmentRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`the route is not success ${req.originalUrl}`, 404));
});

app.use(errorHandler);

const port = process.env.PORT || 2020;

app.listen(port, () => {
  console.log(`Server is ready on port ${port}`);
});
