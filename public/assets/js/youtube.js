// 2. This code loads the IFrame Player API code asynchronously.

const log = (...msg) => {
	//console.log("")
	//console.log(...msg, new Date().getTime())
}

window.videoDuration = 0;
class VideoPlayerTracker {
	constructor(id) {
		this.element = document.getElementById(id)
		this.icons = {
			play: document.getElementById('play-icon'),
			pause: document.getElementById('pause-icon'),
		}
		this.range = document.getElementById('video-range');
		this.range.addEventListener('input', this.trackRange.bind(this))
		this.icons.play.addEventListener('click', this.pause.bind(this))
		this.icons.pause.addEventListener('click', this.play.bind(this))
		this.player = window.player
		this.videoDuration = null;
	}

	play() {
		this.setVideoDuration();
		this.icons.pause.style.display = "none"
		this.icons.play.style.display = ""
	}

	setVideoDuration(){
		const videoDuration = window.videoDuration;
		console.log({videoDuration})
	    this.range.max = videoDuration;
    }

	pause() {
		this.setVideoDuration();
		this.icons.play.style.display = "none"
		this.icons.pause.style.display = ""
	}

	setRange(value) {
		this.range.value = value
	}

	trackRange() {
		console.log(this.range.value)
		return this.range.value;
	}

	getCurrentTime() {
		return this.range.value;
	}
}


const YT_STATES = {
	"-1": "nao iniciado",
	"0": "encerrado",
	"1": "em reprodução",
	"2": "em pausa",
	"3": "armazenando em",
	"5": "vídeo indicado",
}

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
let currentTime = 0;
let lastTimeTracked = 0;
let lastState = null;
let currentState = null;
var youtubeIframe = null
window.player = player;

const playerConfig = {
	height: '360',
	width: "640",//window.outerWidth,
	videoId: '',
	events: { 'onReady': onPlayerReady }
}

function onYouTubeIframeAPIReady() {
	window.player = new YT.Player('player', playerConfig);

	youtubeIframe = player.getIframe();

	window.addEventListener('message', trackTimeChange);

	window.player.addEventListener('onStateChange', (event) => {
		currentState = YT_STATES[event.data];
		log({ currentState })
		handlerAction(currentState);
		lastState = currentState
	})
}

const handlerAction = (newState = "alterou tempo em pausa") => {
	log({ newState, lastState })
	if (lastState === "armazenando em" && newState === "em reprodução") {
		//enviar event ao servidor
		// informando que o usuario mudou o tempo do video em pausa
		return log("change-video-time-and-playing")
	}

	if (lastState === "em pausa" && newState === "armazenando em") return

	if (newState === "em pausa") {
		//enviar evento ao servidor informando que video foi pausado
		return log("pause-video")
	}

	if (newState === "em reprodução") {
		//enviar evento ao servidor informando que video esta sendo reproduzido
		return log("play-video")
	}

	if (newState === "nao iniciado") return;

}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	log("Video pronto")
	player.pauseVideo();
}

//nao tirar
var done = false;

function trackTimeChange(event) {
	if (event.origin !== "https://www.youtube.com") return;
	const data = JSON.parse(event.data);
	event.data = data
	if (!data.info.currentTime) return;
	currentTime = data.info.currentTime
	tracker.setRange(currentTime.toString())
	//console.log(tracker.getCurrentTime())
	//log({currentTime, lastTimeTracked})
	if (lastTimeTracked === currentTime || currentState === "em reprodução") return
	if (currentState === "alterou tempo em pausa" && lastState === "em pausa") return
	//usuario mudou o tempo do video em pausa
	handlerAction();

	lastTimeTracked = currentTime;

}

const tracker = new VideoPlayerTracker("player-tracker")

tracker.icons.play.addEventListener('click', () => {
	window.player.playVideo();
})

tracker.icons.pause.addEventListener('click', () => {
	window.player.pauseVideo();
})

window.tracker = tracker