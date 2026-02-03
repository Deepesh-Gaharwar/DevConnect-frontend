import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

let socket = null;

export const createSocketConnection = () => {
  if (!socket) {
    socket = io(BASE_URL, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: true,
    });
  }
  return socket;
};
