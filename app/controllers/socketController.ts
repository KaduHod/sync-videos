import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Room from '../models/Room';
import { Catch } from '../../utils/errors';
import UserRoom from "../models/UserRoom";

type SocketServerInstance = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
type SocketIncommingRequest = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
var socketInstance:SocketServerInstance;

export default class SocketController {
    constructor(
        private server: SocketServerInstance
    ){
        this.init()
        socketInstance = this.server
    }

    init(){
        this.server.on("connection", this.onConnect.bind(this));
        this.server.on("disconnect", this.onDisconnect.bind(this));

        this.server.of('/').adapter.on("create-room", (room) => {
            console.log("Room created ", {room})
        })
    }

    async onConnect(socket:SocketIncommingRequest){
        console.log(`user connected: ${socket.id}`,process.env.ROOT_DIR)
        socket.on("create-room", this.createRoom.bind(this, socket));
        socket.on("enter-room", this.joinRoom.bind(this, socket));
        socket.on("leave-room", this.leaveRoom.bind(this, socket));
        socket.on("get-rooms-request", this.showRooms.bind(this, socket));
    }

    @Catch(SocketController.errorHandler)
    async joinRoom(socket:SocketIncommingRequest, roomName: string){
        const room = await Room.getRoomByName(roomName);
        if(!room) {
            throw { message: "room does not exists!" }
        }

        await socket.join(roomName);

        this.server.emit('enter-room-response', room)

    }

    async showRooms(socket:SocketIncommingRequest){
        const rooms = await Room.getRooms();
        this.server.emit('get-rooms-response', rooms);
    }

    async onDisconnect(socket:SocketIncommingRequest){
        console.log(socket.id);
    }

    @Catch(SocketController.errorHandler)
    async createRoom(
        userSocket: SocketIncommingRequest,
        roomName: string,
    ){
        const room = new Room(roomName, userSocket.id)
        await userSocket.join(room.name);
        await Room.save(room);

        this.server.emit("room-created", room)
    }

    @Catch(SocketController.errorHandler)
    async leaveRoom(
        userSocket: SocketIncommingRequest,
        userSocketID: string,
        roomID: string,
        roomName: string,
    ){
        const [_, room] = await Promise.all([
            UserRoom.kickUserFromRoom(userSocket.id, roomID),
            Room.getRoomByName(roomName)
        ])

        if(!room) {
            throw { message: `${roomID} not finded!`}
        }
        
        await userSocket.leave(room.name);

        this.server.emit("left-the-room",{id: userSocket.id, roomID});
    }

    public static errorHandler(error:any){
        if(error.constructor.name === "RoomNameNotAvailable") {
            return socketInstance.emit("room-name-not-available", error.roomName);
        }
        console.log({error})
        socketInstance.emit("unknown-error", "sorry, try next time");
    }
}