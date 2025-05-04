const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
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
const messageRoute = require("./routes/messageRoutes");
const { asyncErrorHandler } = require("express-error-catcher");
const User = require("./models/userModels");
const Message = require("./models/messageModels");

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
dotenv.config();

app.use(express.json());

dbConnection();

//Socket Io
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    console.log("Hello");
    try {
      const { message, sender, receiver } = data;

      const senderUser = await User.findById(sender);
      const receiverUser = await User.findById(receiver);

      if (!senderUser || !receiverUser) {
        throw new Error("Sender or receiver not found");
      }

      const newMessage = await Message.create({
        message,
        sender,
        receiver,
      });

      const populatedMessage = await Message.findById(newMessage._id)
        .populate("sender", "_id name role")
        .populate("receiver", "_id name role");

      io.to(socket.id).emit("newMessage", populatedMessage);
      socket.broadcast.emit("newMessage", populatedMessage);
    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use("/user", userRoute);

app.use("/", authRoute);

app.use("/", authDoctorRoute);

app.use("/", uploadRoute);

app.use("/doctor", doctorRoute);

app.use("/appointment", appointmentRoute);

app.use("/message", messageRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`the route is not success ${req.originalUrl}`, 404));
});

app.use(errorHandler);

const port = process.env.PORT || 2020;

server.listen(port, () => {
  console.log(`Server is ready on port ${port}`);
});
