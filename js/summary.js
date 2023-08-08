function removeHelloPageMobile() {
    let helloPage = document.getElementById("helloPageMobile");
    helloPage.classList.add("fadeOut");

    helloPage.addEventListener("transitionend", function () {
    helloPage.style.display = "none";
    });
}

function changeIcon(Id, url) {
    document.getElementById(Id).src = `./assets/img/${url}`;
}