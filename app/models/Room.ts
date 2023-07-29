import { v4 } from 'uuid';
import { readFile, writeFile } from 'fs/promises'
import User from './User';
import UserRoom from './UserRoom';

export class RoomNameNotAvailable extends Error {
    constructor(public roomName: string) {
        super(`Room name ${roomName} not available!`)
    }
}

export default class Room {
    private static roomsFile = process.env.ROOT_DIR + "/database/rooms.json";
    public id: string;
    private createAt: Date;
    constructor(
        private name: string,
        private owner: string
    ){
        this.id = v4();
        this.createAt = new Date();
    }

    public static async getRooms(): Promise<Room[]> {
        return JSON.parse(
            await readFile(Room.roomsFile, 'utf8')
        );
    }

    public static async getRoom(id: string) {
        return (
            await Room.getRooms()
        ).find((room) => room.id === id);
    }

    public static async save(room: Room){
        const rooms = await Room.getRooms();

        const exists = rooms.find((curr) => curr.name === room.name);

        if(exists) {
            throw new RoomNameNotAvailable(room.name)
        }

        rooms.push(room);

        await writeFile(
            Room.roomsFile, 
            JSON.stringify(rooms)
        );
    }    

    public static async addUser(user: User, room: Room) {
        await UserRoom.addUser(user, room)
    }
}