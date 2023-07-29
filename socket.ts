import "./config/global";
import { Server } from "socket.io";

const { SOCKET_PORT } = process.env;

const socket = new Server(
    Number(SOCKET_PORT) ?? 3000
);

socket.on("connection", (socket) => {
    socket.emit("Hello from the server", 1, "2", {3: Buffer.from([4])})
    socket.emit("Hello from client", (...args:any) => {

    })
})