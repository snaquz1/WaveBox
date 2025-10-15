// Сохраняем состояние перед переходом
window.addEventListener('beforeunload', function() {
    const playerState = {
        currentTime: currentAudio.currentTime,
        src: audio.src,
        isPlaying: !currentAudio .paused
    };
    sessionStorage.setItem('playerState', JSON.stringify(playerState));
});

// Восстанавливаем состояние при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const savedState = sessionStorage.getItem('playerState');
    if (savedState) {
        const state = JSON.parse(savedState);
        if (state.src) {
            audio.src = state.src;
            audio.currentTime = state.currentTime;
            if (state.isPlaying) {
                audio.play();
            }
        }
    }
});