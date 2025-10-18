const likeButton = document.querySelector(".like-btn")
let newLikesCount = null

likeButton.addEventListener("click", function (){
    let request = fetch(`/liketrack/${currentAudioId}`).then(response => response.json()).then(data =>{
        currentButton.setAttribute("data-liked", data.liked ? "true" : "false")
        newLikesCount = data.like_count
        currentButton.setAttribute("data-likes-count", newLikesCount)
        check_liked(newLikesCount)
    })
    likeButton.classList.remove("liked"); // сброс анимации
    void likeButton.offsetWidth; // триггер перезапуска
    likeButton.classList.add("liked");
})