searchInput = document.querySelector(".searchbar")

function search(){
    window.location.replace(`/search/${searchInput.value}`)
}