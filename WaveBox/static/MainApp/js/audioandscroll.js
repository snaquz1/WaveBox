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

let currentAudio = null
let currentButton = null
let seekUpdate = null
let volume = null
let volumeImage = document.querySelector(".volume-image")
let currentAudioId = null
let likesCount = document.querySelector(".likes-count")
function playTrack(button){
    let playOverlay = button.closest(".play-overlay")
    let audio = playOverlay.querySelector(".audio")
    let playerButton = document.querySelector(".player-button")

    let trackTitle = document.querySelector(".track-title")
    let trackAuthor = document.querySelector(".artist-name")

    let trackName = button.getAttribute("data-track-name")
    let trackArtistName = button.getAttribute("data-track-author")



    if (currentAudio === audio && !audio.paused){
        audio.pause();
        button.innerHTML = "▶"
        playerButton.innerHTML = "▶"
        clearInterval(seekUpdate)
        return
    }

    if (currentAudio && currentAudio !== audio){
        currentAudio.pause()
        currentAudio.currentTime = 0
        clearInterval(seekUpdate)
        if (currentButton){
            currentButton.innerHTML = "▶"
            playerButton.innerHTML = "▶"
        }
    }


    currentAudio = audio
    currentButton = button
    currentAudioId = button.getAttribute("data-track-id")
    check_liked()

    likesCount.textContent = button.getAttribute("data-likes-count")

    audio.volume = volume
    audio.play()
    startSeekUpdate()

    trackTitle.innerHTML = trackName
    trackAuthor.innerHTML = trackArtistName

    button.innerHTML = "⏸"
    playerButton.innerHTML = "⏸"




    audio.onended = function (){
        currentButton.innerHTML = "▶"
        playerButton.innerHTML = "▶"
        currentAudio = null
        currentButton = null
        clearInterval(seekUpdate)
        resetSeekSlider()

    }
}

function playerPlayTrack(button){
    if (currentAudio && !currentAudio.paused){
        currentAudio.pause()
        button.innerHTML = "▶"
        currentButton.innerHTML = "▶"
        return
    }

    currentAudio.play()
    button.innerHTML = "⏸"
    currentButton.innerHTML = "⏸"
}

function startSeekUpdate(){
    clearInterval(seekUpdate)
    seekUpdate = setInterval(function (){
        if (!currentAudio) return;

        const slider =  document.querySelector(".simple-seek-slider")
        const currentTime = document.querySelector(".current-time")
        const totalTime = document.querySelector(".total-time")

        if (currentAudio.duration){
            const progress = (currentAudio.currentTime / currentAudio.duration) * 100
            slider.value = progress

            currentTime.textContent = formatTime(currentAudio.currentTime)
            totalTime.textContent = formatTime(currentAudio.duration)
        }
    }, 100)
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60); // Минуты: секунды / 60
    const secs = Math.floor(seconds % 60); // Секунды: остаток от деления на 60
    return `${mins}:${secs.toString().padStart(2, '0')}`; // Формат: 3:05
}

function resetSeekSlider() {
    const slider = document.querySelector('.simple-seek-slider');
    const currentTime = document.querySelector('.current-time');

    if (slider) slider.value = 0;          // Ставим ползунок в начало
    if (currentTime) currentTime.textContent = "0:00"; // Сбрасываем время
}

document.addEventListener('DOMContentLoaded', function() {
    // Находим ползунок на странице
    const slider = document.querySelector('.simple-seek-slider');

    if (slider) {
        // Слушаем, когда пользователь двигает ползунок
        slider.addEventListener('input', function() {
            // Если есть текущее аудио и оно загрузилось
            if (currentAudio && currentAudio.duration) {
                // Вычисляем куда перематывать: (ползунок% / 100) * общее время
                const seekTime = (this.value / 100) * currentAudio.duration;
                currentAudio.currentTime = seekTime; // Перематываем аудио!
            }
        });
    }

    let volumeSlider = document.querySelector(".simple-volume-slider")
    volume = volumeSlider.value / 100
    if (volumeSlider){
        volumeSlider.addEventListener("input", function (){
            if (currentAudio){
                volume = volumeSlider.value / 100
                currentAudio.volume = volume
                if (volume === 0){
                    volumeImage.src = "/media/images/icons/novolume.png"
                }else {
                    volumeImage.src = "/media/images/icons/volume.png"
                }
            }
        })
    }

    const volumeButton = document.querySelector(".volume-button")
    volumeButton.addEventListener("click", function (){
        setGlobalVolume(volumeSlider, 0)
        volumeImage.src = "/media/images/icons/novolume.png"
    })
});

function setGlobalVolume(slider, value){
    volume = value;
    slider.value = value;
    currentAudio.volume = value;
}

function check_liked(newLikesCount){
    if (currentButton.getAttribute("data-liked") === "true"){
        likeButton.textContent = "❤️"
    }else {
        likeButton.textContent = "❤"
    }
    likesCount.textContent = newLikesCount;

}