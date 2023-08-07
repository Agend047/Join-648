function removeHelloPageMobile() {
    let helloPage = document.getElementById("helloPageMobile");
    helloPage.classList.add("fadeOut");

    helloPage.addEventListener("transitionend", function () {
    helloPage.style.display = "none";
    });
}