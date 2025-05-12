const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const compression = require("compression");
const errorHandler = require("./middleware/errorHandler");
const ApiError = require("./utils/apiError");
const dbConnection = require("./config/dbConnection");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const uploadRoute = require("./routes/uploadImageRoutes");
const doctorRoute = require("./routes/doctorRoutes");
const authDoctorRoute = require("./routes/authDoctorRoutes");
const appointmentRoute = require("./routes/appointmentRoutes");
const messageRoute = require("./routes/messageRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const paymentRoute = require("./routes/paymentCreditCardRoutes");
const notificationRoute = require("./routes/notificationRoutes");

const { handlerMessage } = require("./utils/socketHandler/handlerMessage");
const { webhookCheckout } = require("./server/paymentCreditCard-server");

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    METHODS: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

app.use(morgan("dev"));
app.use(cors("*"));
app.use(compression());
dotenv.config();

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.use(express.json());

dbConnection();

//Socket Io
const connectedUsers = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    handlerMessage(io, socket, data);
  });

  socket.on("register", (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(`user id ${userId} register with id ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (let userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
        break;
      }
    }
    console.log("Client disconnected:", socket.id);
  });
});

app.set("io", io);
app.set("connectedUsers", connectedUsers);

app.use("/user", userRoute);

app.use("/", authRoute);

app.use("/", authDoctorRoute);

app.use("/", uploadRoute);

app.use("/doctor", doctorRoute);

app.use("/appointment", appointmentRoute);

app.use("/message", messageRoute);

app.use("/notification", notificationRoute);

app.use("/review", reviewRoute);

app.use("/payment", paymentRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`the route is not success ${req.originalUrl}`, 404));
});

app.use(errorHandler);

const port = process.env.PORT || 2020;

server.listen(port, () => {
  console.log(`Server is ready on port ${port}`);
});
