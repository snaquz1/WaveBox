const likeButton = document.querySelector(".like-btn")

likeButton.addEventListener("click", function (){
    let request = fetch(`/liketrack/${currentAudioId}`).then(response => response.json()).then(data =>{
        currentButton.setAttribute("data-liked", data.liked ? "true" : "false")
        check_liked()
    })
})