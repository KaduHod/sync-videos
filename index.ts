import "./config/global";
import "./socket";
import express from "express";
import { engine } from "express-handlebars";

const server = express();
server.engine('.hbs', engine({ extname: ".hbs" }));
server.set("view engine", ".hbs");
server.set("views", "./public/views");
server.use(express.static("./public/assets"))

server.get("/", (req, res) => {
    res.render("home")
})

const port = Number(process.env.APP_PORT ?? 8000);

server.listen(port, () => {
    console.log(`Web server running on port ${port}`)
    console.log(`Web socket server running on port ${process.env.SOCKET_PORT}`)
})