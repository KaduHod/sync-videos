import { readFile, writeFile } from 'fs/promises'; 

export default class User {
    public static usersFile = process.env.ROOT_DIR + "/database/users.json";
    constructor(
        public id: string
    ){}

    public static async getUsers(): Promise<User[]> {
        return JSON.parse(
            await readFile(User.usersFile,"utf8")
        )
    }

    public static async getUser(id:string) {
        return (
            await User.getUsers()
        ).find((user) => user.id === id);
    }
}