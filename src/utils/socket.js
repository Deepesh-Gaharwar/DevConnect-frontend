import io from "socket.io-client";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createSocketConnection = () => {
    return io(BASE_URL);   
};