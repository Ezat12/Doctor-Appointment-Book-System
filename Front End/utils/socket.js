import { io } from "socket.io-client";

export const socket = io("http://localhost:2020", {
  transports: ["websocket", "polling"],
  autoConnect: true,
  withCredentials: true,
});
