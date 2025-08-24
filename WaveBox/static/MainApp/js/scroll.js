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

let currentAudio = null; // Храним текущее играющее аудио
let currentButton = null; // Храним текущую активную кнопку

const playButtons = document.querySelectorAll(".play-button");

playButtons.forEach(button => {
    button.addEventListener("click", function() {
        const trackItem = this.closest('.track-item');
        const audioElement = trackItem.querySelector('.audio');

        // Если это же аудио уже играет - ставим на паузу
        if (currentAudio === audioElement && !audioElement.paused) {
            audioElement.pause();
            this.innerHTML = "▶"
            this.classList.remove('playing');
            currentAudio = null;
            currentButton = null;
            return;
        }

        // Останавливаем текущее аудио если играет другое
        if (currentAudio && currentAudio !== audioElement) {
            currentAudio.pause();
            this.innerHTML = "▶"
            currentAudio.currentTime = 0; // Сбрасываем на начало
            if (currentButton) {
                currentButton.classList.remove('playing');
            }
        }

        // Запускаем новое аудио
        audioElement.play();
        this.innerHTML = "⏸"
        this.classList.add('playing');

        // Обновляем текущие элементы
        currentAudio = audioElement;
        currentButton = this;

        // Обработчик окончания трека
        audioElement.onended = function() {
            currentButton.classList.remove('playing');
            currentButton.innerHTML = "▶"
            currentAudio = null;
            currentButton = null;

        };
    });
});




