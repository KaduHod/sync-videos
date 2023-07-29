import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Room from '../models/Room';
import { Catch } from '../../utils/errors';

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
        this.server.on("connection", this.onConnect.bind(this))
        this.server.on("disconnect", this.onDisconnect.bind(this))
    }

    async onConnect(socket:SocketIncommingRequest){
        console.log(`user connected: ${socket.id}`,process.env.ROOT_DIR)
        socket.on("create-room", this.createRoom.bind(this, socket.id))
    }

    async onDisconnect(socket:SocketIncommingRequest){
        console.log(socket.id); // undefined
    }

    @Catch(SocketController.errorHandler)
    async createRoom(
        userID: string,
        roomName: string,
    ){
        const room = new Room(roomName, userID)
        await Room.save(room)
    }

    public static errorHandler(error:any){
        if(error.constructor.name === "RoomNameNotAvailable") {
            return socketInstance.emit("room-name-not-available", error.roomName);
        }
        socketInstance.emit("unknown-error", "sorry, try next time");
    }
}