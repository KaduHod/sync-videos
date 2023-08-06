import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io();

window.socket = socket

function getVideoId(url){
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) 
        ? url[2].split(/[^0-9a-z_\-]/i)[0] 
        : url[0];
}

class ClientSocket {
    constructor(socket) {
        this.socket = socket;
        this.initListeners()
    }

    initListeners(){
        this.socket.on("change-video", this.changeVideoServer.bind(this));
        this.socket.on("play-video", this.playVideoSever.bind(this));
        this.socket.on("pause-video", this.pauseVideoSever.bind(this));
        this.socket.on("seek-to-video", this.seekToSever.bind(this));
    }

    pauseVideoSever(){
        console.log('server: pauseVideoSever')
        window.tracker.pauseFeature();
        window.player.pauseVideo()
    }

    playVideoSever(){
        console.log('server: playVideoSever')
        window.tracker.playFeature();
        window.player.playVideo()
    }

    seekToSever(time){
        console.log('server: seekToSever', {time})
    }

    async changeVideoServer(videoID){
        console.log('server: changeVideoServer', {videoID})
        window.changeVideo(videoID);
    }

    connect(){
        this.socket.connect();
    }

    getVideoID(){
        return window.videoID;
    }

    emitPlayVideo(){
        this.socket.emit('play-video');
    }

    emitPauseVideo(){
        this.socket.emit('pause-video');
    }

    emitChangeVideo(){
        this.socket.emit('change-video', window.videoID);
    }   

    emitSeekTo(time){
        this.socket.emit('seek-to-video', time);
    }
}

const client = new ClientSocket(window.socket);
client.connect();

window.clientSocket = client