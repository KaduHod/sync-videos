import { Express, Request, Response } from "express";

export default class ServerController {
    constructor(private server: Express){
        this.init()
    }

    init(){
        this.server.get("/", this.home);
        this.server.get("/rooms", this.rooms);
    }


    public async home(req: Request, res: Response) {
        res.render("home");
    }

    public async rooms(req: Request, res: Response) {
        res.render("rooms");
    }
}