import { Express, Request, Response } from "express";
import YoutubeApi from "../services/youtubeAPI";

export default class ServerController {
    constructor(
        private server: Express,
        private youtubeService: YoutubeApi
    ){
        this.init()
    }

    init(){
        this.server.get("/", this.home);
        this.server.get("/rooms", this.rooms);
        this.server.get("/video-info", this.videoInfo.bind(this));
        this.server.get("/video-duration", this.videoDuration.bind(this));
    }

    public async home(req: Request, res: Response) {
        res.render("home");
    }

    public async rooms(req: Request, res: Response) {
        res.render("rooms");
    }

    public async videoInfo(req: Request, res: Response) {
        const {id} = req.query
        return res.send(
            await this.youtubeService.getVideoInfo(id as string)
        )
    }

    public async videoDuration(req: Request, res: Response) {
        const {id} = req.query
        return res.send(
            {duration: await this.youtubeService.getVideoDuration(id as string)}
        )
    }
}