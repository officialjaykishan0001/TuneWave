// var favoritemovie = "Shrek";
// sessionStorage.setItem("favoriteMovie", favoritemovie);



console.log("let's write Javascript")
// Global Variable declaration
let slide_no = 3;

// Edit the url and insert the 'songs' word
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

// Control the Image slider at home Page
function sliderShow() {
    if (slide_no == 10) {
        slide_no = 1;
    }
    let banner = document.querySelector(".banner")
    // console.log(banner)

    let div = document.createElement("div")
    div.setAttribute("class", "slide banner-design")

    let slideImg = document.createElement("img")
    slideImg.src = `img/banners/Banner-${slide_no + 1}.webp`
    slide_no += 1
    div.append(slideImg)
    banner.append(div)

}


async function loadAblum(songCardFolder, songContNo) {

    let a = await fetch(`/songs/${songCardFolder}`)
    let response = await a.text()

    // Finding list of the song album folders
    let div = document.createElement("div")
    div.innerHTML = response

    let as = div.getElementsByTagName('a')
    let albumList = []
    Array.from(as).forEach((element) => {
        if (!(element.href.endsWith(".mp3"))) {
            albumList.push(EditSongUrl(`/songs/${songCardFolder}`, element.href))

        }
    })


    // Load the album folder 
    // let songCont = document.querySelector(".song-container")
    let songCont = Array.from(document.querySelectorAll(".song-container"))[songContNo]

    // We have to load artist card 
    if (songCardFolder == "Artist") {
        albumList.forEach((element, index) => {
            let songName = element.split(`${songCardFolder}/`)[1].replace("/", "").replaceAll("%20", " ")
            songCont.innerHTML += `                <div class=" song-card artist-card ">
            <div class="song-thumbnail">
                <img src="${element}/songCardCover.webp" alt="">
            </div>
            <div class="song-title">
                <span>${songName}</span>
            </div>
        </div>
    `
        })
    }
    // If we have to load default song card
    else {
        albumList.forEach((element, index) => {
            let songName = element.split(`${songCardFolder}/`)[1].replace("/", "").replaceAll("%20", " ")
            songCont.innerHTML += `                <div class=" song-card ">
            <div class="song-thumbnail">
            <img src="${element}/songCardCover.webp" alt="">
            </div>
            <div class="song-title">
            <span>${songName}</span>
            </div>
            </div>
            `
        })
    }

}


async function main() {
    // Calls slideerShow in each 3s
    setInterval(() => {
        sliderShow()
    }, 3000);


    // Call the load Ablum function to load all the albums
    // load the `new release's song cards`
    await loadAblum("New_realese", 0)

    //  load the `Indie Music's song cards`
    await loadAblum("Indie_music", 1)

    // load the `aritst' song cards`
    await loadAblum("Artist", 2)

    // Whenever Anyone Click on the song card Redirect it on new Page

    // whenever Anyone Click on the song card of the first song container redirect it on new page
    let firstSongCont = document.querySelector("#firstSongCont")
    let SongCard = firstSongCont.getElementsByClassName("song-card")


    Array.from(SongCard).forEach(element => {
        element.addEventListener("click", () => {
            // Passed the informatino what Song-Album is clicked
            let fName = "New_realese/" + element.querySelector(".song-title").firstElementChild.innerHTML
            var clickedAlbum = fName;
            sessionStorage.setItem("clickedAlbum", clickedAlbum);

            // Redirect
            window.location.href = "playStation.html"
        })

    });

    // whenever Anyone Click on the song card of the second song container redirect it on new page
    let secondSongCont = document.querySelector("#secondSongCont")
    SongCard = secondSongCont.getElementsByClassName("song-card")


    Array.from(SongCard).forEach(element => {
        element.addEventListener("click", () => {
            // Passed the informatino what Song-Album is clicked
            let fName = "Indie_music/" + element.querySelector(".song-title").firstElementChild.innerHTML
            var clickedAlbum = fName;
            sessionStorage.setItem("clickedAlbum", clickedAlbum);

            // Redirect
            window.location.href = "playStation.html"
        })

    });

    
    // whenever Anyone Click on the song card of the third song container redirect it on new page
    let thirdSongCont = document.querySelector("#thirdSongCont")
    SongCard = thirdSongCont.getElementsByClassName("song-card")


    Array.from(SongCard).forEach(element => {
        element.addEventListener("click", () => {
            // Passed the informatino what Song-Album is clicked
            let fName = "Artist/" + element.querySelector(".song-title").firstElementChild.innerHTML
            var clickedAlbum = fName;
            sessionStorage.setItem("clickedAlbum", clickedAlbum);

            // Redirect
            window.location.href = "playStation.html"
        })

    });



    // Hamburger functioning for pc
    // opening 
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".hamburger-container-pc").style.display = "flow-root"
    })
    //closing 
    document.querySelector("main").addEventListener("click", ()=>{
        document.querySelector(".hamburger-container-pc").style.display = "none"
    })


    // Hamburger functioning for mobile
    // opening 
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".hamburger-container-mobile").style.right = "-2px"
        // document.querySelector(".hamburger-container-pc").style.display = "none"
        
    })
    //closing 
    document.querySelector(".hamburger-login-svg").addEventListener("click", ()=>{
        document.querySelector(".hamburger-container-mobile").style.right = "-85vw"
        document.querySelector(".hamburger-container-pc").style.display = "none"
    })

}

main()