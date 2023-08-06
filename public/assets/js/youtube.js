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
		this.range.addEventListener('input', this.trackRange.bind(this));
		this.range.addEventListener('mouseover', this.showRangeValue.bind(this));
		this.range.addEventListener('mouseout', this.hideRangeValue.bind(this));
		this.timeCounter = document.getElementById("time-counter");
		this.minutes = document.getElementById("minutes");
		this.seconds = document.getElementById("seconds");
		this.totalMinutes = document.getElementById("minutes-total");
		this.totalSeconds = document.getElementById("seconds-total");
		this.icons.play.addEventListener('click', this.playVideo.bind(this));
		this.icons.pause.addEventListener('click', this.pauseVideo.bind(this));
		this.player = window.player;
		this.videoDuration = null;
		console.log(this)
	}

	setTotalTimer(minutes, seconds){
		this.totalMinutes.textContent = minutes;
		this.totalSeconds.textContent = seconds;
	}

	setMinutes(minutes){
		this.minutes.textContent = minutes
	}

	setSeconds(seconds){
		this.seconds.textContent = seconds
	}

	showRangeValue(){
		this.range.textContent = this.range.value
	}

	hideRangeValue(){
		this.range.textContent = ""
	}

	playVideo() {
		this.setVideoDuration();
		this.playFeature()
		window.player.playVideo();
		window.clientSocket.emitPlayVideo();
	}

	playFeature(){
		this.icons.play.style.display = "none"
		this.icons.pause.style.display = ""
	}

	setVideoDuration(){
		const videoDuration = window.videoDuration;
	    this.range.max = videoDuration;
    }

	pauseVideo() {
		this.setVideoDuration();
		this.pauseFeature()
		window.player.pauseVideo();
		window.clientSocket.emitPauseVideo();
	}

	pauseFeature(){
		this.icons.pause.style.display = "none"
		this.icons.play.style.display = ""
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
	if (!data?.info?.currentTime) return;
	currentTime = data.info.currentTime;
	const totalSeconds = currentTime.toString()
	tracker.setRange(totalSeconds);
	const [minutes, seconds] = secondsToMinutesSeconds(totalSeconds);
	tracker.setMinutes(minutes.toString());
	tracker.setSeconds(seconds.toString());
	lastTimeTracked = currentTime;
}

function secondsToMinutesSeconds(segundos) {
	const minutos = Math.floor(segundos / 60);
	const segundosRestantes = segundos % 60;
	const formatoMinutos = minutos < 10 ? `0${minutos}` : minutos;
	const formatoSegundos = segundosRestantes < 10 
		? `0${Math.floor(segundosRestantes)}` 
		: Math.floor(segundosRestantes);
	return [ formatoMinutos, formatoSegundos ];
}

window.secondsToMinutesSeconds = secondsToMinutesSeconds;

const tracker = new VideoPlayerTracker("player-tracker")

window.tracker = tracker