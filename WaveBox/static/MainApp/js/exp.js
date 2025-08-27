let currentAudio = null
function playTrack(button){
    let playOverlay = button.closest(".play-overlay")
    let audio = playOverlay.querySelector(".audio")

    if (currentAudio === audio && !audio.paused){
        console.log("pause pressed")
        audio.pause();
        button.innerHTML = "▶"
        currentAudio = null
        return
    }

    if (currentAudio && currentAudio !== audio){
        currentAudio.pause()
        currentAudio.currentTime = 0
        if (currentButton){
            currentButton.innerHTML = "▶"
        }
    }


    currentAudio = audio
    currentButton = button
    audio.play()
    button.innerHTML = "⏸"

    audio.onended = function (){
        currentButton.innerHTML = "▶"
        currentAudio = null
        currentButton = null

    }
}