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

let playButtons = document.querySelectorAll(".play-button")
playButtons.forEach(button =>{
    button.addEventListener("click", function (){
        audio.play()
    })
})




