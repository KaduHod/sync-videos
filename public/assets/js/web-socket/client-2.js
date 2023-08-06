import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io();

socket.connect();

window.socket = socket

function getVideoId(url){
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) 
        ? url[2].split(/[^0-9a-z_\-]/i)[0] 
        : url[0];
}