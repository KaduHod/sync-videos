import { converISO8602 } from "../../utils/time";
export default class YoutubeApi {
    constructor(){}

    public async getVideoInfo(id:string){
        const url:string = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${process.env.API_KEY?.trim()}&part=contentDetails`;
        const req = await fetch(url);
        return await req.json();
    }

    public async getVideoDuration(id:string){
        const res = await this.getVideoInfo(id);
        return converISO8602(res.items[0].contentDetails.duration);
    }
}