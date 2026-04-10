import { io } from "socket.io-client";
export const initializeSocketConnection = () => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

    const socket = io(socketUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        withCredentials: true
    })
    socket.on("connect", () => {
        // console.log("connected to Socket.io server");
    });

}