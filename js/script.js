// БД песен
const songs = [
	{
		artits: 'Pearl Jam',
		title: 'Wishlist',
		cover: 'img/covers/PJ.jpg',
		audio: 'audio/Pearl Jam - Wishlist.mp3',
	},
	{
		artits: 'Queen Of The Stone Age',
		title: 'Make It Wit Chu',
		cover: 'img/covers/QOTSA.jpg',
		audio: 'audio/Queen Of The Stone Age - Make It Wit Chu.mp3',
	},
	{
		artits: 'Tool',
		title: 'Forty Six & 2',
		cover: 'img/covers/TOOL.jpg',
		audio: 'audio/Tool - Forty Six & 2.mp3',
	},
];

const page = document.querySelector('.page'),
	audioPlayer = document.querySelector('.audio-player'),
	btnPlay = audioPlayer.querySelector('.controls__play'),
	btnPlayImg = audioPlayer.querySelector('.btn-play-img'),
	btnPrev = audioPlayer.querySelector('.controls__prev'),
	btnNext = audioPlayer.querySelector('.controls__next'),

	cover = audioPlayer.querySelector('.audio-player__cover'),
	coverImage = audioPlayer.querySelector('.cover-image'),

	artistName = audioPlayer.querySelector('.track__artist'),
	songName = audioPlayer.querySelector('.track__song'),

	progressCtr = audioPlayer.querySelector('.progress-bar__container'),
	progress = audioPlayer.querySelector('.progress-bar__progress'),
	slider = audioPlayer.querySelector('.progress-bar__slider'),

	total = audioPlayer.querySelector('.progress-bar__total'),
	current = audioPlayer.querySelector('.progress-bar__current'),

	volumeBtn = audioPlayer.querySelector('.volume__btn'),
	volumeIcon = audioPlayer.querySelector('.volume__icon'),
	volumeCtr = audioPlayer.querySelector('.volume__container'),
	volumeProgress = audioPlayer.querySelector('.volume__progress'),
	volumeSlider = audioPlayer.querySelector('.volume__slider'),

	audioTrack = audioPlayer.querySelector('.audio-track');

//* ==========================================================================================================

// Загрузка песни
let indexSong = 0;

function getSong(index) {
	artistName.innerHTML = songs[index].artits;
	songName.innerHTML = songs[index].title;
	page.style.backgroundImage = `url("${songs[index].cover}")`;
	coverImage.src = songs[index].cover;
	audioTrack.src = songs[index].audio;
}
getSong(indexSong);

// Проигрывание и остановка песни
let isPlay = false;

function playSong() {
	isPlay = true;
	audioTrack.play();
	btnPlayImg.src = 'img/icons/pause.svg';
	cover.classList.add('active');
}

function pauseSong() {
	isPlay = false;
	audioTrack.pause();
	btnPlayImg.src = 'img/icons/play.svg';
	cover.classList.remove('active');
}

btnPlay.addEventListener('click', () => {
	if (isPlay) {
		pauseSong();
	} else {
		playSong();
	}
});

// Переключение песен
function nextSong() {
	indexSong++;

	if (indexSong > songs.length - 1) {
		indexSong = 0;
	}

	getSong(indexSong);

	if (isPlay) {
		playSong();
	}
}

function prevSong() {
	indexSong--;

	if (indexSong < 0) {
		indexSong = songs.length - 1;
	}

	getSong(indexSong);

	if (isPlay) {
		playSong();
	}
}

btnNext.addEventListener('click', () => {
	nextSong();
});
btnPrev.addEventListener('click', () => {
	prevSong();
});

audioTrack.addEventListener('ended', nextSong); // Autoplay


// Прогресс бар + время трека
function progressBar(event) {
	const { duration, currentTime } = event.srcElement;

	let progressStatus = (currentTime / duration) * 100;
	progress.style.width = `${progressStatus}%`;
	slider.style.left = `${progressStatus - 1}%`;
	current.innerHTML = getTime(currentTime);
}

audioTrack.addEventListener('timeupdate', progressBar);

// Перемещение ползунка
function changeProgress(event) {
	const widthCtr = progressCtr.clientWidth,
		currentClick = event.offsetX,
		durationAudio = audioTrack.duration;

	audioTrack.currentTime = (currentClick / widthCtr) * durationAudio;
}

progressCtr.addEventListener('click', changeProgress);

// Обработка времени трека
function getTime(time) {
	let seconds = parseInt(time),
		minutes = parseInt(seconds / 60),
		hours = parseInt(minutes / 60);

	seconds -= minutes * 60;
	minutes -= hours * 60;

	if (hours === 0) {
		return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
	} else {
		return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`;
	}
}

// Общее время трека
audioTrack.addEventListener('loadeddata', () => {
	total.innerHTML = getTime(audioTrack.duration);
	audioTrack.currentTime = 0;
	audioTrack.volume = 0.50;
});

// Громкость воспроизведения
function changeVolume(event) {
	const widthCtr = volumeCtr.clientWidth,
		currentClick = Math.abs(event.offsetX),
		currentVolume = currentClick / widthCtr;

	audioTrack.volume = currentVolume;
	volumeProgress.style.width = currentVolume * 100 + '%';
}

volumeCtr.addEventListener('click', changeVolume);

// Вкл/выкл звука
volumeBtn.addEventListener('click', () => {
	audioTrack.muted = !audioTrack.muted;
	if (audioTrack.muted) {
		volumeBtn.classList.add('off');
	} else {
		volumeBtn.classList.remove('off');
	}
});