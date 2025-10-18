document.addEventListener('DOMContentLoaded', function() {
    let commentWrote = document.querySelector(".comment-wrote").value
    if (commentWrote === "True"){
        document.querySelector(".comment-section").scrollIntoView();
    }
})