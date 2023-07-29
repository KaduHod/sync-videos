import "./config/global";
import express from "express";
import { createServer } from "http";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import ServerController from "./app/controllers/serverController";
import SocketController from "./app/controllers/socketController";

const { APP_PORT } = process.env;

const server = express();
server.engine('.hbs', engine({ extname: ".hbs" }));
server.set("view engine", ".hbs");
server.set("views", "./public/views");
server.use(express.static("./public/assets"));

const httpServer = createServer(server);
const socket = new Server(httpServer);

new ServerController(server);
new SocketController(socket)

const port = Number(APP_PORT ?? 8000);

httpServer.listen(port, () => {
    console.log(`Web server running on port http://localhost:${port}`)
    console.log(`Web-socket server running on port ws://localhost:${port}`)
})