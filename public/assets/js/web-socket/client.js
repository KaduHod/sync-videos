import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io();
const form = document.forms['create-room'];
const roomNameInput = form.elements['room-name'];
const createRoomButton = form.elements['send'];
const roomInfo = document.getElementById("room-info");
const leaveRoom = document.getElementById("leave-room");
const roomNameSpan = document.getElementById("current-room");
const roomid = document.getElementById("room-id");
const showRoomsButton = document.getElementById("show-rooms");
const roomsList = document.getElementById('rooms-list');
const changeVideoButton = document.getElementById('change-video-button');
const changeVideoinput = document.getElementById('change-video');



socket.connect();

window.socket = socket

changeVideoButton.addEventListener('click', () => {
    console.log("aqui", changeVideoinput.value)
    const id = YouTubeGetID(changeVideoinput.value)
    window.player.loadVideoById(id,0);
    socket.emit('change-video', id);
    window.player.pauseVideo();
})

socket.on('change-video', (id) => {
    window.player.loadVideoById(id,0);
    window.player.pauseVideo();
})

socket.on('play-video', (time) => {
    window.player.seekTo(time);
    window.player.playVideo();
})

socket.on('pause-video', (time) => {
    window.player.seekTo(time);
    window.player.pauseVideo();
})

showRoomsButton.addEventListener("click", () => {
    socket.emit('get-rooms-request'); 
    let showList = showRoomsButton.innerText === "Mostrar salas"
    
    if(showList) {
        showRoomsButton.innerText = "Esconder salas";
        roomsList.style.display = "";
    } else {
        showRoomsButton.innerText = "Mostrar salas";
        roomsList.style.display = "none";
    }
})

socket.on("change-video", (videoID) => {
    console.log(`Change video:${videoID}`)
})

socket.on('get-rooms-response', (rooms) => {
    let list = "";

    const disabled = !!roomid.value ? "disabled" : "";

    for(const room of rooms) {
        list+=`<li>
            <span>${room.name}</span>
            <button 
                data-room-name="${room.name}" 
                data-room-id="${room.id}"
                ${disabled}
                class="enter-room rounded-sm bg-slate-900 text-white w-32 hover:scale-95"
            >entrar</button>
        </li>`
    }

    roomsList.innerHTML = list;

    const buttons = [...document.getElementsByClassName('enter-room')]
    buttons.forEach(button => {
        button.addEventListener('click', ({target}) => {
            const {roomName} = target.dataset
            socket.emit("enter-room", roomName)
        })
    })
})

window.socket = socket;

socket.on("connect", () => {
    console.log("Connected:",socket.connected)
})

socket.on('enter-room-response', (room) => {
    console.log("room created:", room);
    roomNameSpan.innerText = room.name;
    roomInfo.style.display = ""
    roomid.value = room.id;

    const enterRoomButtons = [...document.getElementsByClassName('enter-room')]
    enterRoomButtons.forEach(button => {
        button.disabled = true;
    })

})

socket.on("disconnect", () => {
    console.log("Connected:",socket.connected)
});

socket.on("room-name-not-available", (...args) => {
    console.log("room-name-not-available",...args)
})

socket.on("room-created", (room) => {
    console.log("room created:", room);
    roomNameSpan.innerText = room.name;
    roomInfo.style.display = ""
    roomid.value = room.id;
})

socket.on("left-the-room", ({userID, roomID}) => {
    console.log("user left the room", {userID, roomID});
    roomNameSpan.innerText = "";
    roomInfo.style.display = "none"
    roomid.value = "";
    const enterRoomButtons = [...document.getElementsByClassName('enter-room')]
    enterRoomButtons.forEach(but => {
        but.disabled = false;
    })
})

socket.on("unknown-error", (...args) => {
   alert("unknow-error", ...args)
})

roomNameInput.addEventListener("input", event => {
    createRoomButton.disabled = !roomNameInput.value || !roomid.value
})

form.addEventListener('submit', (event) => {
    event.preventDefault();
})

createRoomButton.addEventListener('click', (event) => {
    if(roomid.value) {
        return alert("Saia da sala para criar uma nova");
    }

    if(!roomNameInput.value.trim()) {
        return alert("Escolha um nome para a sala antes de criar");
    }

    socket.emit("create-room", roomNameInput.value, socket.id)
    roomNameInput.value = ""
    createRoomButton.disabled = "true"
});

leaveRoom.addEventListener("click", () => {
    socket.emit("leave-room", socket.id, roomid.value, roomNameSpan.innerText)
})


function YouTubeGetID(url){
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}