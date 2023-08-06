import "./config/global";
import express from "express";
import { createServer } from "http";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import ServerController from "./app/controllers/serverController";
import SocketController from "./app/controllers/socketController";
import YoutubeApi from "./app/services/youtubeAPI";

const { APP_PORT } = process.env;

const server = express()
    .engine('.hbs', engine({ extname: ".hbs" }))
    .set("view engine", ".hbs")
    .set("views", "./public/views")
    .use(express.static("./public/assets"));

const httpServer = createServer(server);
const socket = new Server(httpServer);

new ServerController(server, new YoutubeApi());
new SocketController(socket);

const port = Number(APP_PORT ?? 8000);

httpServer.listen(port, () => {
    console.log(`Web server running on port http://localhost:${port}`)
    console.log(`Web-socket server running on port ws://localhost:${port}`)
})