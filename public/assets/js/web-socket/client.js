import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io();

window.socket = socket

socket.connect();

socket.on("connect", () => {
    console.log("Connected:",socket.connected)
})

socket.on("disconnect", () => {
    console.log("Connected:",socket.connected)
});

socket.on("room-name-not-available", (...args) => {
    console.log("room-name-not-available",...args)
})

socket.on("unknown-error", (...args) => {
    alert("unknow-error", ...args)
})

//socket.emit("create-room", "sala namorados", socket.id)

const form = document.forms['create-room'];
const roomNameInput = form.elements['room-name'];
const createRoomButton = form.elements['send'];
form.addEventListener('submit', (event) => {
    event.preventDefault();
})
createRoomButton.addEventListener('click', (event) => {
    if(!roomNameInput.value.trim()) {
        return alert("Escolha um nome para a sala antes de criar");
    }

    socket.emit("create-room", roomNameInput.value, socket.id)
})