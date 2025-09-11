document.addEventListener('DOMContentLoaded', function() {
    const trackWrappers = document.querySelectorAll('.tracks-wrapper');

    trackWrappers.forEach(wrapper => {
        const nextBtn = wrapper.parentElement.querySelector('.next');
        const prevBtn = wrapper.parentElement.querySelector('.prev');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                wrapper.scrollBy({ left: 1000, behavior: 'smooth' });
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                wrapper.scrollBy({ left: -1000, behavior: 'smooth' });
            });
        }
    });
});
let playerAudio = document.querySelector(".player-audio")
let currentAudio = null
let currentButton = null
function playTrack(button){
    let playOverlay = button.closest(".play-overlay")
    let audio = playOverlay.querySelector(".audio")

    if (currentAudio === audio && !audio.paused){
        audio.pause();
        button.innerHTML = "▶"
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
    playerAudio.innerHTML = currentAudio
    currentButton = button
    audio.play()
    button.innerHTML = "⏸"
    playerButton.innerHTML = "⏸"


    audio.onended = function (){
        currentButton.innerHTML = "▶"
        currentAudio = null
        currentButton = null

    }
}

function playerPlayTrack(button){
    if (currentAudio && !currentAudio.paused){
        currentAudio.pause()
        button.innerHTML = "▶"
        return
    }

    currentAudio.play()
    button.innerHTML = "⏸"
}
