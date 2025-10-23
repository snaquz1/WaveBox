// saveplayerstate.js

// Глобальные переменные
let currentAudio = null;
let currentButton = null;
let seekUpdate = null;
let volume = 0.75;
let volumeImage = document.querySelector(".volume-image");
let currentAudioId = null;
let likesCount = document.querySelector(".likes-count");

// Инициализация глобального плеера
function initGlobalPlayer() {
    const globalAudio = document.getElementById('global-audio');
    if (!globalAudio) {
        console.error('Global audio element not found');
        return;
    }

    // Восстанавливаем состояние при загрузке
    restorePlayerState();

    // Настраиваем обработчики для глобального аудио
    globalAudio.addEventListener('loadedmetadata', function() {
        updateSeekDisplay();
    });

    globalAudio.addEventListener('ended', function() {
        const trackButtons = Array.from(document.querySelectorAll(".play-button"));
        const currentAudioId = currentButton.getAttribute("data-track-id");
        const currentIndex = trackButtons.findIndex(btn => btn.getAttribute("data-track-id") === currentAudioId);
        if (currentIndex !== -1){
            const nextButton = trackButtons[currentIndex + 1];
            if (nextButton){
                play(nextButton)
            }else {
                console.log("LastTrack")
                play(trackButtons[0])
            }
        }
    });
}

// Функция для обновления глобального плеера
function updateGlobalPlayer(trackData) {
    const globalAudio = document.getElementById('global-audio');
    const globalButton = document.querySelector('.global-play-btn');

    if (!globalAudio) return;

    // Обновляем данные глобального аудио элемента
    globalAudio.src = trackData.audioSrc;
    globalAudio.currentTime = trackData.currentTime || 0;
    globalAudio.volume = volume;

    // Обновляем данные кнопки
    if (globalButton) {
        globalButton.setAttribute('data-track-id', trackData.trackId);
        globalButton.setAttribute('data-track-name', trackData.trackName);
        globalButton.setAttribute('data-track-author', trackData.artistName);
        globalButton.setAttribute('data-likes-count', trackData.likesCount || '0');
        globalButton.setAttribute('data-liked', trackData.isLiked || 'false');
    }

    // Устанавливаем глобальные переменные
    currentAudio = globalAudio;
    currentButton = globalButton;
    currentAudioId = trackData.trackId;
}

// Модифицированная функция play
function play(button) {
    let playOverlay = button.closest(".play-overlay");
    let audio = playOverlay.querySelector(".audio");
    let playerButton = document.querySelector(".player-button");

    let playerTrackImage = document.querySelector(".player-track-image")
    let trackImagesrc = button.getAttribute("data-track-image-src")
    let trackTitle = document.querySelector(".track-title");
    let trackLink = document.querySelector(".track-link");
    let trackAuthor = document.querySelector(".artist-name");
    let authorLink = document.querySelector(".artist-link")
    let trackName = button.getAttribute("data-track-name");
    let trackArtistName = button.getAttribute("data-track-author");
    let trackId = button.getAttribute("data-track-id");
    let likesCountValue = button.getAttribute("data-likes-count");
    let isLiked = button.getAttribute("data-liked");

    // Если это тот же трек и он играет - ставим на паузу
    if (currentAudioId === trackId && currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        if (playerButton) playerButton.innerHTML = "▶";
        clearInterval(seekUpdate);
        savePlayerState();
        return;
    }

    // Подготавливаем данные для глобального плеера
    const trackData = {
        audioSrc: audio.src,
        currentTime: 0, // Начинаем с начала
        trackId: trackId,
        trackName: trackName,
        artistName: trackArtistName,
        likesCount: likesCountValue,
        isLiked: isLiked
    };

    // Если играл другой трек - останавливаем его визуально
    if (currentAudio && currentAudioId !== trackId) {
        clearInterval(seekUpdate);
    }

    // Обновляем глобальный плеер
    updateGlobalPlayer(trackData);

    // Запускаем воспроизведение
    currentAudio.volume = volume;
    currentAudio.play().then(() => {
        startSeekUpdate();

        // Обновляем UI
        if (playerTrackImage) playerTrackImage.src = trackImagesrc
        if (trackTitle) trackTitle.innerHTML = trackName;
        if (trackLink) trackLink.href = `/track/${currentButton.getAttribute("data-track-id")}`
        if (trackAuthor) trackAuthor.innerHTML = trackArtistName;
        if (authorLink) authorLink.href = `/profile/${trackArtistName}`;
        if (playerButton) playerButton.innerHTML = "⏸";

        check_liked();

        if (likesCount) {
            likesCount.textContent = likesCountValue;
        }

        savePlayerState();
    }).catch(error => {
        console.error('Play failed:', error);
    });
}

// Сохраняем состояние плеера
function savePlayerState() {
    if (currentAudio && currentAudio.src) {
        const playerState = {
            audioSrc: currentAudio.src,
            currentTime: currentAudio.currentTime,
            isPlaying: !currentAudio.paused,
            volume: volume,
            trackId: currentAudioId,
            playerTrackImage: document.querySelector(".player-track-image").src,
            trackName: document.querySelector(".track-title")?.textContent || '',
            trackLink: document.querySelector(".track-link")?.href || '',
            artistName: document.querySelector(".artist-name")?.textContent || '',
            authorLink: document.querySelector(".artist-link")?.href || '',
            likesCount: likesCount?.textContent || '0',
            isLiked: currentButton.getAttribute("data-liked") === "true"
        };
        localStorage.setItem('musicPlayerState', JSON.stringify(playerState));
    }
}

// Восстанавливаем состояние плеера
function restorePlayerState() {
    const savedState = localStorage.getItem('musicPlayerState');
    if (!savedState) return;

    try {
        const state = JSON.parse(savedState);

        // Создаем данные для глобального плеера
        const trackData = {
            audioSrc: state.audioSrc,
            currentTime: state.currentTime || 0,
            trackId: state.trackId,
            playerTrackImage: state.playerTrackImage,
            trackName: state.trackName,
            trackLink: state.trackLink,
            artistName: state.artistName,
            authorLink: state.authorLink,
            likesCount: state.likesCount,
            isLiked: state.isLiked,
            volume: state.volume
        };

        // Обновляем глобальный плеер
        updateGlobalPlayer(trackData);
        if (currentAudio) currentAudio.volume = state.volume;

        // Восстанавливаем UI
        const playerTrackImage = document.querySelector(".player-track-image")
        const trackTitle = document.querySelector(".track-title");
        const trackLink = document.querySelector(".track-link")
        const trackAuthor = document.querySelector(".artist-name");
        const authorLink = document.querySelector(".artist-link");
        const playerButton = document.querySelector(".player-button");
        const volumeSlider = document.querySelector(".simple-volume-slider");

        if (playerTrackImage) playerTrackImage.src = state.playerTrackImage;
        if (trackTitle) trackTitle.textContent = state.trackName;
        if (trackLink) trackLink.href = state.trackLink;
        if (trackAuthor) trackAuthor.textContent = state.artistName;
        if (authorLink) authorLink.href = state.authorLink;
        if (likesCount) likesCount.textContent = state.likesCount;
        if (volumeSlider.value !== 0) volumeSlider.value = state.volume * 1;
        else{
            volumeSlider.value = 1;
        }

        volume = state.volume || 0.5;

        // Обновляем кнопки
        if (playerButton) {
            playerButton.innerHTML = state.isPlaying ? "⏸" : "▶";
        }

        // Обновляем лайк
        const likeButton = document.querySelector(".like-btn");
        if (likeButton) {
            likeButton.setAttribute("data-liked", state.isLiked.toString());
            if (state.isLiked) {
                likeButton.textContent = "❤️";
            } else {
                likeButton.textContent = "❤";
            }
        }

        // Обновляем изображение громкости
        if (volumeImage) {
            if (volume === 0) {
                volumeImage.src = "/media/images/icons/novolume.png";
            } else {
                volumeImage.src = "/media/images/icons/volume.png";
            }
        }

        // Если трек был воспроизводимым, запускаем обновление прогресса
        if (state.isPlaying && currentAudio) {
            // Ждем загрузки метаданных
            if (currentAudio.readyState >= 1) {
                currentAudio.play().then(() => {
                    startSeekUpdate();
                }).catch(e => {
                    console.log('Autoplay prevented:', e);
                    // Все равно обновляем отображение прогресса
                    updateSeekDisplay();
                });
            } else {
                currentAudio.addEventListener('loadedmetadata', function() {
                    currentAudio.play().then(() => {
                        startSeekUpdate();
                    }).catch(e => {
                        console.log('Autoplay prevented:', e);
                        updateSeekDisplay();
                    });
                });
            }
        } else {
            updateSeekDisplay();
        }

    } catch (error) {
        console.error('Error restoring player state:', error);
    }
}

// Остальные функции остаются без изменений
function startSeekUpdate() {
    clearInterval(seekUpdate);
    seekUpdate = setInterval(function() {
        if (!currentAudio) return;

        const slider = document.querySelector(".simple-seek-slider");
        const currentTime = document.querySelector(".current-time");
        const totalTime = document.querySelector(".total-time");

        if (currentAudio.duration) {
            const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
            if (slider) slider.value = progress;
            if (currentTime) currentTime.textContent = formatTime(currentAudio.currentTime);
            if (totalTime) totalTime.textContent = formatTime(currentAudio.duration);
        }

        // Автосохранение каждые 10 секунд
        if (Math.floor(currentAudio.currentTime) % 10 === 0) {
            savePlayerState();
        }
    }, 100);
}

function updateSeekDisplay() {
    if (!currentAudio) return;

    const slider = document.querySelector(".simple-seek-slider");
    const currentTime = document.querySelector(".current-time");
    const totalTime = document.querySelector(".total-time");

    if (currentAudio.duration) {
        const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
        if (slider) slider.value = progress;
        if (currentTime) currentTime.textContent = formatTime(currentAudio.currentTime);
        if (totalTime) totalTime.textContent = formatTime(currentAudio.duration);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function resetSeekSlider() {
    const slider = document.querySelector('.simple-seek-slider');
    const currentTime = document.querySelector('.current-time');
    const totalTime = document.querySelector('.total-time');

    if (slider) slider.value = 0;
    if (currentTime) currentTime.textContent = "0:00";
    if (totalTime) totalTime.textContent = "0:00";
}

function playTrack(button) {
    play(button);
}

function playerPlayTrack(button) {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        button.innerHTML = "▶";
        if (currentButton) currentButton.innerHTML = "▶";
        savePlayerState();
        return;
    }

    if (currentAudio) {
        currentAudio.play().then(() => {
            button.innerHTML = "⏸";
            if (currentButton) currentButton.innerHTML = "⏸";
            startSeekUpdate();
            savePlayerState();
        });
    }
}

function setGlobalVolume(slider, value) {
    volume = value;
    if (slider) slider.value = value;
    if (currentAudio) currentAudio.volume = value;
    savePlayerState();
}

function check_liked(newLikesCount) {
    const likeButton = document.querySelector(".like-btn");
    if (likeButton && currentButton) {
        if (currentButton.getAttribute("data-liked") === "true") {
            likeButton.textContent = "❤️";
        } else {
            likeButton.textContent = "❤";
        }
    }
    if (likesCount) {
        likesCount.textContent = newLikesCount;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем глобальный плеер
    initGlobalPlayer();

    // Инициализируем слайдеры и навигацию
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

    const slider = document.querySelector('.simple-seek-slider');
    if (slider) {
        slider.addEventListener('input', function() {
            if (currentAudio && currentAudio.duration) {
                const seekTime = (this.value / 100) * currentAudio.duration;
                currentAudio.currentTime = seekTime;
                savePlayerState();
            }
        });
    }

    let volumeSlider = document.querySelector(".simple-volume-slider");
    if (volumeSlider) {
        volumeSlider.value = volume * 100;
        volumeSlider.addEventListener("input", function() {
            volume = volumeSlider.value / 100;
            if (currentAudio) {
                currentAudio.volume = volume;
            }
            if (volumeImage) {
                if (volume === 0) {
                    volumeImage.src = "/media/images/icons/novolume.png";
                } else {
                    volumeImage.src = "/media/images/icons/volume.png";
                }
            }
            savePlayerState();
        });
    }

    const volumeButton = document.querySelector(".volume-button");
    if (volumeButton) {
        volumeButton.addEventListener("click", function() {
            setGlobalVolume(volumeSlider, 0);
            if (volumeImage) {
                volumeImage.src = "/media/images/icons/novolume.png";
            }
        });
    }

    // Сохраняем состояние перед закрытием/переходом
    window.addEventListener('beforeunload', savePlayerState);
    window.addEventListener('pagehide', savePlayerState);

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            savePlayerState();
        }
    });
});