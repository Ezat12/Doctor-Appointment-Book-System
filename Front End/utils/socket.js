import { io } from "socket.io-client";

export const socket = io(
  "https://doctor-appointment-book-system-production.up.railway.app",
  {
    transports: ["websocket", "polling"],
    autoConnect: true,
    withCredentials: true,
  }
);
