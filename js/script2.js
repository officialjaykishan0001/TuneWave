var clikedAlbum = sessionStorage.getItem("clickedAlbum");
// console.log(clikedAlbum);

console.log("Let's write js")


// Some Global variable 
let songsUrl
let currentSong = new Audio()
let CurrSongFolder = clikedAlbum

console.log(CurrSongFolder)

function addDurationToSongCard(m_url) {
    let m = new Audio()
    m.src = m_url
    return secondsToMinutesSeconds(m.duration)
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

function EditSongUrl(folder, URL) {
    let CorrectUrl = ""
    for (let i = 0; i < 21; i++) {
        CorrectUrl += URL[i]
    }
    CorrectUrl += folder
    for (let i = 21; i < URL.length; i++) {
        CorrectUrl += URL[i];
    }
    return CorrectUrl
}


async function getSongs() {

    let a = await fetch(`/songs/${CurrSongFolder}`)
    let response = await a.text();
    // console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;
    // console.log(div)

    let as = Array.from(div.getElementsByTagName('a'))
    let songsURL = [];
    as.forEach(element => {
        if (element.href.endsWith("mp3")) {
            // EditSongUrl : edits the song's url with respect to folder name
            songsURL.push(EditSongUrl(`/songs/${CurrSongFolder}`, element.href))
        }
    });

    // Update the right->heading according to number of songs
    document.querySelector(".heading").querySelector("p").innerHTML = `${songsURL.length} Songs`

    return songsURL

}

async function addSongs() {

    songsUrl = await getSongs();
    let songsContainer = document.querySelector(".song-list")



    songsUrl.forEach(element => {
        let songName = element.replaceAll("%", " ").split(`songs/${CurrSongFolder}/`)[1]
        let dur = addDurationToSongCard(element)
        songsContainer.innerHTML += ` <div class="song-card">
        <div class="album-img">
            <img src="/songs/${CurrSongFolder}/songCardCover.webp" alt="">
            <div class="song-name">
                <span>${songName}</span>
            </div>
        </div>
        <div class="artist">
            <span>Jay Kishan</span>
        </div>
        <div class="album">
            <span>album</span>
        </div>
        <div class="duration">
            <span>${dur}</span>
        </div>
        <div class="song-download">
            <img class="invert" src="img/cirDownload.svg" alt="">
            <img class="invert" src="img/optionsDot.svg" alt="">
        </div>
    </div>
   `
    });

    // Update the left album big picture 
    document.querySelector(".card-img-left").firstElementChild.src = `songs/${CurrSongFolder}/songCardCover.webp`

    // Update the left->left-text folder Name
    document.querySelector(".left-text").lastElementChild.innerHTML = `&ofcir; ${CurrSongFolder.split("/")[1]}`

    // Update the right->heading folder Name
    document.querySelector(".heading").firstElementChild.innerHTML = `${CurrSongFolder.split("/")[1]}`

    // Update the playbar -> name-info -> album-artist-info -> Artist name, album name
    document.querySelector(".album-artist-info").firstElementChild.innerHTML = "Jay kishan"
    document.querySelector(".album-artist-info").lastElementChild.innerHTML = `${CurrSongFolder.split("/")[1]}`


}


const playMusic = (track, pause = false) => {

    currentSong.src = track

    if (!pause) {
        currentSong.play()
        document.querySelector(".play-botton").firstElementChild.src = "img/pause-button.svg"
    }

    // display the name of song at the playbar
    let songName = document.querySelector(".name-info")
    songName.firstElementChild.innerHTML = decodeURI(currentSong.src.split(`songs/${CurrSongFolder}/`)[1])

}

async function main() {
    // Add songs on the song-list Container
    await addSongs()
    playMusic(songsUrl[0], true)

    // Play the music whenever the song card is clicked and update the playbar with respect to it
    Array.from(document.querySelectorAll(".song-card")).forEach((element, index) => {
        element.addEventListener("click", () => {
            playMusic(songsUrl[index], false)
        })

    })



    // Add EventListener to Previous Button
    document.querySelector(".prev-botton").addEventListener("click", () => {
        let idx = songsUrl.indexOf(currentSong.src)
        if (idx != 0) {
            idx = idx - 1
            playMusic(songsUrl[idx])
        }

    })


    // Add EventListener to Next Button
    document.querySelector(".next-botton").addEventListener("click", () => {
        let idx = songsUrl.indexOf(currentSong.src)
        if (idx < songsUrl.length) {
            idx = idx + 1
            playMusic(songsUrl[idx])
        }

    })

    // Add EventListener to play Button
    document.querySelector(".play-botton").addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play()
            document.querySelector(".play-botton").firstElementChild.src = "img/pause-button.svg"
        }
        else {
            currentSong.pause()
            document.querySelector(".play-botton").firstElementChild.src = "img/play-button.svg"
        }


    })

    // Seekbar duration Adjusted 
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".playbar-duration").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".playline-circle").style.left = `${((currentSong.currentTime / currentSong.duration) * 100) - 1}%`
        document.querySelector(".playLine").style.background = ` linear-gradient(to right, red ${((currentSong.currentTime / currentSong.duration) * 100) - 0.5}%, white 0%)`
        document.querySelector(".playLine").addEventListener("click", (e) => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".playline-circle").style.left = percent + "%"
            currentSong.currentTime = ((currentSong.duration) * percent) / 100;
        })


        if (currentSong.ended) {
            document.querySelector(".play-botton").firstElementChild.src = "img/play-button.svg"
        }

    })

    // Add event listener to volume range at playbar
    document.querySelector(".volume-range").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume == 0) {
            document.querySelector(".volume-button > img").src = "img/mute.svg"
        }
        else {
            document.querySelector(".volume-button > img").src = "img/volume.svg"
        }
    })

    // Add event listener to volume speaker for mute
    document.querySelector(".volume-button > img").addEventListener("click", () => {
        console.log(currentSong.volume)
        if(currentSong.volume == 0){
            currentSong.volume = 0.50
            document.querySelector(".volume-range").value = 50
            document.querySelector(".volume-button > img").src = "img/volume.svg"
        }
        else{
            currentSong.volume = 0
            document.querySelector(".volume-range").value = 0
            document.querySelector(".volume-button > img").src = "img/mute.svg"
        }
    })

    // add event listener to the play-songs red button
    document.querySelector(".play-songs").addEventListener("click", () => {
        if ((currentSong.paused)) {
            playMusic(songsUrl[0])

        }

    })

    // Redirect when click on logo
    document.querySelector(".logo").addEventListener("click", () => {
        window.location.href = "index.html"
    })


    // Hamburger functioning for pc
    // opening 
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".hamburger-container-pc").style.display = "flow-root"
    })
    //closing 
    document.querySelector("main").addEventListener("click", () => {
        document.querySelector(".hamburger-container-pc").style.display = "none"
    })


    // Hamburger functioning for mobile
    // opening 
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".hamburger-container-mobile").style.right = "-2px"
        // document.querySelector(".hamburger-container-pc").style.display = "none"

    })
    //closing 
    document.querySelector(".hamburger-login-svg").addEventListener("click", () => {
        document.querySelector(".hamburger-container-mobile").style.right = "-85vw"
        document.querySelector(".hamburger-container-pc").style.display = "none"
    })



}

main()