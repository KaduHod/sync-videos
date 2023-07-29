import Room from "./Room";
import User from "./User";
import { readFile, writeFile } from 'fs/promises'

export default class UserRoom {
    private static usersRoomsFile = process.env.ROOT_DIR + "/database/users_room.json";
    constructor(
        private userID: string, 
        private roomID: string
    ){}

    public static async getUsersByRoom(roomID: string){
        return (
            await UserRoom.getAll()
        ).filter((userRoom) => userRoom.roomID === roomID)
    }

    public static async getAll(): Promise<UserRoom[]>{
        return JSON.parse(
            await readFile(UserRoom.usersRoomsFile, "utf8")
        );
    }

    public static async addUser(user: User, room: Room) {
        const [userExists, roomExists] = await Promise.all([
            User.getUser(user.id),  Room.getRoom(room.id)
        ]);

        if(!userExists || !roomExists) {
            throw {
                message: "Failed because users or room does not exists", 
                userExists, 
                roomExists
            }
        }

        const usersRooms = JSON.parse(await readFile(UserRoom.usersRoomsFile, "utf8"))
        usersRooms.push({
            userId: user.id,
            roomId: room.id
        })
    }
}