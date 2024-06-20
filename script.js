
let currSong = new Audio();
let songs = [];
let currFolder;

const playMusic = (track) => {
	const displayTrackName = track.replaceAll("%20", " ").replace("(PagalWorld.com.sb).mp3", "");
	currSong.src = `http://127.0.0.1:3000/Spotify%20Clone/songs/${currFolder}/${track}`;
	currSong.play();
	document.querySelector(".songinfo").innerHTML = displayTrackName;
	document.querySelector(".songtime").innerHTML = "00:00/00:00";
}


async function getSongs(folder) {
	currFolder = folder;
	let a = await fetch(`http://127.0.0.1:3000/Spotify%20Clone/songs/${folder}/`);

	let response = await a.text();
	console.log(response);
	let div = document.createElement("div");
	songs = []
	div.innerHTML = response;
	let as = div.getElementsByTagName("a");

	for (let index = 0; index < as.length; index++) {
		const element = as[index];
		if (element.href.endsWith(".mp3"))
			songs.push(element.href.split(`${currFolder}/`)[1]);
	}

	let songUL = document.querySelector(".songs").getElementsByTagName("ul")[0];
	songUL.innerHTML = "";
	for (const song of songs) {
		let songName = song.replace("(PagalWorld.com.sb).mp3", "").trim();
		songUL.innerHTML = songUL.innerHTML + `<li>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
								class="bi bi-music-note-beamed" viewBox="0 0 16 16">
								<path
									d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2" />
								<path fill-rule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z" />
								<path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z" />
							</svg>
							<div class="info">
								<div> ${song.replaceAll("%20", " ").replace("(PagalWorld.com.sb).mp3", "")} </div>
								<div> Song Artist</div>
							</div>
							<div class="play-song">
								<div>Play Now</div>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
									<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
									<path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
								  </svg>
							</div>
						</li>`;
	}


	Array.from(document.querySelector(".songs").getElementsByTagName("li")).forEach(e => {
		e.addEventListener("click", element => {
			let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
			console.log(songName);
			playMusic(songName + "(PagalWorld.com.sb).mp3");
		})

	});

	return songs
}

function secondsToMinutesSeconds(seconds) {
	if (isNaN(seconds) || seconds < 0) {
		return "00:00";
	}

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	const formattedMinutes = String(minutes).padStart(2, '0');
	const formattedSeconds = String(remainingSeconds).padStart(2, '0');

	return `${formattedMinutes}:${formattedSeconds}`;
}


async function displayAlbums() {

	let a = await fetch(`http://127.0.0.1:3000/Spotify%20Clone/songs/`);

	let response = await a.text();
	let div = document.createElement("div");
	div.innerHTML = response;

	let as = div.getElementsByTagName("a");

	Array.from(as).forEach(e => {
		if (e.href.includes("/songs")) {
			console.log(e.href.split("/").slice(-2)[0]);
		}
	})
}

async function main() {
	songs = await getSongs("library");

	console.log(songs);

	playMusic(songs[0], true);

	displayAlbums();


	present.addEventListener("click", () => {
		if (currSong.paused) {
			currSong.play();
			present.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
				<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.271 5.055a.5.5 0 0 0-.271.455v5.98a.5.5 0 0 0 .77.424l4.6-2.99a.5.5 0 0 0 0-.848l-4.6-2.99a.5.5 0 0 0-.5-.03z"/>
			</svg>`;

		} else {
			currSong.pause();
			present.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
				<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"/>
			</svg>`;
		}
	});


	currSong.addEventListener("timeupdate", () => {
		//console.log(currSong.currentTime, currSong.duration);
		document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currSong.currentTime)}/${secondsToMinutesSeconds(currSong.duration)}`;
		document.querySelector(".circle").style.left = ((currSong.currentTime) / currSong.duration) * 100 + "%";
	})


	document.querySelector(".seekbar").addEventListener("click", e => {
		let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
		document.querySelector(".circle").style.left = percent + "%";
		currSong.currentTime = (currSong.duration * percent) / 100
	})

	document.querySelector(".hamburger").addEventListener("click", () => {
		document.querySelector(".left").style.left = "0";
	})

	document.querySelector(".close").addEventListener("click", () => {
		document.querySelector(".left").style.left = "-130%";
	})

	prev.addEventListener("click", () => {
		currSong.pause()
		console.log("Previous clicked")
		let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
		console.log(index);
		console.log(currSong[index]);
		if ((index - 1) >= 0) {
			playMusic(songs[index - 1])
		}
		else playMusic(songs[songs.length-1]);
	})

	next.addEventListener("click", () => {
		currSong.pause();
		console.log("Next clicked");

		let index = songs.indexOf(currSong.src.split("/").slice(-1)[0]);

		console.log(index);
		console.log(currSong[index]);
		if ((index + 1) < songs.length) {
			playMusic(songs[index + 1]);
		}
		else playMusic(songs[0]);
	})

	Array.from(document.getElementsByClassName("card")).forEach(e => {
		e.addEventListener("click", async item => {
			songs = await getSongs(`${item.currentTarget.dataset.folder}`);

		})
	})
}
main()